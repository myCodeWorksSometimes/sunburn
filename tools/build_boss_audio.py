"""Distinct CC0 creature/foley edits and original minor-key boss scores.
Usage: python tools/build_boss_audio.py path/to/audio-sources
Requires numpy and ffmpeg, not used by the game at runtime.
"""
import sys,subprocess,shutil,wave,tempfile
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1];source=Path(sys.argv[1]);out=root/'public/audio'
foley=source/'foley';monster=next((source/'monsters').rglob('monster-1.wav')).parent
ffmpeg=shutil.which('ffmpeg') or str(next(Path.home().glob('AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe')))
events=['idle','intro','windup','attack','magic','hurt','stagger','enrage','death']
# Different performances for every event in a set, not one roar with renamed files.
performances={'fivehand':[2,5,7,9,14,8,11,16,13], 'braced':[3,1,6,10,17,4,15,14,12], 'warden':[4,16,2,15,11,7,8,5,17]}
def encode(name,file,filters,target=-22):
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(file),'-af',filters+f',loudnorm=I={target}:TP=-3:LRA=8','-ar','44100','-c:a','libvorbis','-q:a','4',str(out/f'{name}.ogg')],check=True)
for profile,takes in performances.items():
    for event,take in zip(events,takes):
        rate={'fivehand':.83,'braced':.68,'warden':.75}[profile]
        if event=='attack':rate*=1.16
        filters=f'asetrate={int(44100*rate)},aresample=44100,highpass=f=65,lowpass=f=3600'
        if profile=='fivehand':filters+=',aecho=0.6:0.4:80|160:0.22|0.12'
        if profile=='warden':filters+=',aecho=0.7:0.5:210:0.3'
        if event=='idle':filters+=',atrim=0:2.2,afade=t=out:st=1.6:d=0.6'
        encode(f'{profile}-{event}',monster/f'monster-{take}.wav',filters)
# Rowan's impact is a close body/cloth thump, distinct from creature voices.
encode('rowan-hurt',foley/'sfx100v2_hit_02.ogg','highpass=f=90,lowpass=f=2500')

# Original scores: restrained bowed harmonics, descending lament, low pulse.
# Each loop is eight 4-second bars. Note envelopes meet silence at the seam.
sr=22050;duration=32
def note(buf,start,length,midi,gain,pan=0,rough=False):
    n=int(length*sr);t=np.arange(n)/sr;f=440*2**((midi-69)/12)
    env=np.minimum(1,t/.55)*np.minimum(1,np.maximum(0,length-t)/.9)
    vibrato=.0018*np.sin(2*np.pi*4.7*t)
    tone=sum(np.sin(2*np.pi*f*k*t*(1+vibrato))*(1/k**1.8) for k in range(1,6))
    if rough:tone+=.08*np.sin(2*np.pi*(f*1.006)*t)
    a=int(start*sr);n=min(n,len(buf)-a)
    buf[a:a+n,0]+=tone[:n]*env[:n]*gain*(1-pan*.35)
    buf[a:a+n,1]+=tone[:n]*env[:n]*gain*(1+pan*.35)
for j,profile in enumerate(performances):
    buf=np.zeros((duration*sr,2),np.float64)
    transpose=[0,-2,3][j];roots=[38,34,41,36,38,34,36,33]
    for bar,rootnote in enumerate(roots):
        start=bar*4
        for k,interval in enumerate([0,7,15]):note(buf,start,4,rootnote+transpose+interval,.095/(k+1),(-1)**k*.5,True)
        # Soft double pulse: tension without a dance beat.
        for beat in range(4):
            a=int((start+beat)*sr);n=int(.22*sr);t=np.arange(n)/sr
            pulse=np.sin(2*np.pi*(43+22*np.exp(-t*30))*t)*np.exp(-t*24)*.055
            buf[a:a+n]+=pulse[:,None]
    melody=[[65,64,62,57,60,58,57,53],[60,62,65,63,60,58,55,53],[69,67,65,64,62,60,58,57]][j]
    for i,midi in enumerate(melody):note(buf,i*4+.4,3.2,midi+transpose,.065,.25)
    buf=np.tanh(buf)*.8
    with tempfile.NamedTemporaryFile(suffix='.wav',delete=False) as tmp:path=Path(tmp.name)
    with wave.open(str(path),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((buf*32767).astype('<i2').tobytes())
    encode(f'{profile}-score',path,'afade=t=in:d=0.4,afade=t=out:st=31:d=1',-24)
    path.unlink()
print('Built 27 distinct boss event edits, Rowan impact and 3 original 32-second scores.')
