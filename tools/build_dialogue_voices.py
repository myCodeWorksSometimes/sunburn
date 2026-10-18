"""Generate bundled, replaceable synthetic character reads using Windows voices.
This is local TTS, not a claim of performed/emotional voice acting.
"""
import ast,hashlib,json,re,subprocess,tempfile,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'public/voices';out.mkdir(exist_ok=True)
q=r'''(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")'''
lines={}
for file in (root/'src').rglob('*.js'):
    for m in re.finditer(r'speaker:\s*('+q+r')\s*,\s*text:\s*('+q+r')',file.read_text(encoding='utf-8')):
        speaker,text=map(ast.literal_eval,m.groups())
        if any(n in speaker for n in ['Rowan','Eli','Mara','Tomas','Nia']):lines[f'{speaker}|{text}']={'speaker':speaker,'text':text}
# Conditional lines are authored branches, not text literals beside speaker.
for speaker,texts in {
 'Nia':['My hands are warm. Mama said you would come.','Eli sent us down the old road when the bell rang. He did not come.'],
 'Tomas':['You brought us through. We will keep the far-bank fire.','Clear the foundry, secure the bridge, then come back for us.'],
 'Rowan':['They made it across. Eli, you gave them a chance.','The refuge still waits inside its fire.'],
 'Echo Mara':['It cannot hold the court any longer.','You found it every time. Eli always did too.'],
}.items():
    for text in texts:lines[f'{speaker}|{text}']={'speaker':speaker,'text':text}
profiles={'Rowan':('Microsoft David Desktop',-1,.96),'Eli':('Microsoft Zira Desktop',1,1.13),
          'Mara':('Microsoft Zira Desktop',-1,.95),'Tomas':('Microsoft David Desktop',-2,.85),'Nia':('Microsoft Zira Desktop',0,1.18)}
with tempfile.TemporaryDirectory(prefix='embers-voices-') as tmp:
    tmp=Path(tmp);jobs=[]
    for key,line in lines.items():
        who=next(n for n in profiles if n in line['speaker']);voice,rate,pitch=profiles[who]
        ident=hashlib.sha256(key.encode()).hexdigest()[:14];line.update(id=ident,voice=voice,rate=rate,pitch=pitch,wav=str(tmp/f'{ident}.wav'))
        jobs.append(line)
    # Child-like wordless memory cue, distinct from spoken dialogue.
    jobs.append(dict(id='eli-chuckle',text='Ha. Ha ha.',speaker='Echo Eli',voice='Microsoft Zira Desktop',rate=2,pitch=1.18,wav=str(tmp/'eli-chuckle.wav')))
    pending=[j for j in jobs if '--force' in __import__('sys').argv or not (out/f"{j['id']}.ogg").exists()]
    (tmp/'jobs.json').write_text(json.dumps(pending,ensure_ascii=False),encoding='utf-8-sig')
    script="""param($jobsPath)
Add-Type -AssemblyName System.Speech
$reader = New-Object System.Speech.Synthesis.SpeechSynthesizer
foreach ($job in (Get-Content -LiteralPath $jobsPath -Raw -Encoding UTF8 | ConvertFrom-Json)) {
  $reader.SelectVoice($job.voice); $reader.Rate=$job.rate
  $reader.SetOutputToWaveFile($job.wav); $reader.Speak($job.text); $reader.SetOutputToNull()
}
$reader.Dispose()
"""
    (tmp/'speak.ps1').write_text(script,encoding='utf-8-sig')
    subprocess.run(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(tmp/'speak.ps1'),str(tmp/'jobs.json')],check=True)
    ffmpeg=shutil.which('ffmpeg') or str(next(Path.home().glob('AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe')))
    manifest={}
    for job in jobs:
        pitch=job['pitch'];filters=f'asetrate={int(22050*pitch)},aresample=44100,atempo={1/pitch},highpass=f=90'
        if 'Echo' in job['speaker'] or 'Recorded' in job['speaker']:filters+=',aecho=0.7:0.4:130:0.18'
        filters+=',afade=t=in:d=0.03,loudnorm=I=-21:TP=-3:LRA=7'
        dest=f"voices/{job['id']}.ogg"
        if job in pending:subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',job['wav'],'-af',filters,'-ar','44100','-c:a','libvorbis','-q:a','3',str(root/'public'/dest)],check=True)
        manifest[f"{job['speaker']}|{job['text']}"]=dest
    manifest['@eli-chuckle']='voices/eli-chuckle.ogg'
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Generated {len(jobs)-1} dialogue reads and one child-like synthetic laugh.')
