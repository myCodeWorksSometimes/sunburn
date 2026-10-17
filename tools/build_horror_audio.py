"""Offline edits of the CC0 Ogrebane/rubberduck recordings (LICENSES.md).
Pass the downloaded/extracted audio-sources directory. No runtime synthesis.
"""
import sys,subprocess,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]);foley=source/'foley'
monster=next((source/'monsters').rglob('monster-1.wav')).parent
ffmpeg=shutil.which('ffmpeg') or str(next(Path.home().glob('AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin/ffmpeg.exe')))
out=root/'public/audio'
def convert(name,file,filters):
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(file),'-af',filters+',loudnorm=I=-22:TP=-3:LRA=8','-c:a','libvorbis','-q:a','4',str(out/f'{name}.ogg')],check=True)
convert('stalk',monster/'monster-3.wav','asetrate=33075,aresample=44100,lowpass=f=2400')
convert('snarl',monster/'monster-6.wav','asetrate=39690,aresample=44100,highpass=f=90')
convert('lunge',monster/'monster-10.wav','asetrate=48510,aresample=44100,highpass=f=100')
convert('summon',monster/'monster-17.wav','asetrate=26460,aresample=44100,aecho=.7:.5:120:.25')
convert('blade',foley/'sfx100v2_metal_02.ogg','highpass=f=250')
convert('machinery',foley/'sfx100v2_metal_04.ogg','asetrate=33075,aresample=44100')
convert('memory-surge',foley/'sfx100v2_thunder_01.ogg','areverse,asetrate=33075,aresample=44100,afade=t=in:d=0.3,afade=t=out:st=2:d=1')
convert('memory-break',foley/'sfx100v2_air_03.ogg','asetrate=26460,aresample=44100,aecho=.7:.4:140:.3')
# Non-melodic soundscape: recorded environmental bed and slowed machinery.
# Fade both ends rather than pop at the loop seam. No voices on the base bed.
subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-stream_loop','-1','-i',str(foley/'sfx100v2_loop_ambient_03.ogg'),'-stream_loop','-1','-i',str(foley/'sfx100v2_loop_machine_02.ogg'),'-filter_complex','[0:a]asetrate=22050,aresample=44100,lowpass=f=1100,highpass=f=45,volume=.7[a];[1:a]asetrate=11025,aresample=44100,lowpass=f=280,volume=.3[b];[a][b]amix=inputs=2:normalize=0,atrim=0:48,afade=t=in:d=1.5,afade=t=out:st=46:d=2,loudnorm=I=-25:TP=-4:LRA=8[out]','-map','[out]','-t','48','-c:a','libvorbis','-q:a','4',str(out/'score.ogg')],check=True)
print('Built 8 cues and 48-second recorded horror ambience')
subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-stream_loop','-1','-i',str(foley/'sfx100v2_loop_machine_04.ogg'),'-t','24','-af','asetrate=22050,aresample=44100,lowpass=f=620,tremolo=f=1.7:d=0.7,afade=t=in:d=1,afade=t=out:st=22:d=2,loudnorm=I=-26:TP=-4:LRA=8','-c:a','libvorbis','-q:a','4',str(out/'bossbed.ogg')],check=True)
shutil.copyfile(foley/'sfx100v2_footstep_wet_02.ogg',out/'step-wet.ogg')
