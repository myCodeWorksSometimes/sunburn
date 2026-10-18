import {A3,RELAYS} from './layout.js';

// Next physical action, not merely the final quest coordinate. Kept pure so
// expired memories, backtracking and each staged test route can be checked.
export function navigationHint({run,x,feet=560,memory,weapon,swingX=9820}){
  const hint=(x,y,text)=>({x,y,text});
  const fire=(x,text)=>hint(x,560,run.flame<25?'Hold R at this fire for 2s to refill flame.':text);
  if(weapon?.drawn&&weapon.drop)return hint(weapon.drop.x,weapon.drop.floor,'Return to your grounded lantern and press X to carry its light.');
  if(x>=7980&&x<8770&&!run.campReturnOpen)return memory==='camp'
    ?hint(8760,560,'The remembered rope bridge is solid. Walk right across it; the return route will stay open.')
    :fire(8120,'E at the campfire rebuilds the crossing. Wait for the light to reach the far bank.');
  if(x>=8800&&x<10400&&!run.swingReturnOpen){
    if(memory!=='swings')return fire(9110,'Remember the playground fire. The swing moves only in its light.');
    if(x<9725)return hint(9735,560,'Walk to the near edge, then jump right onto the moving swing board.');
    return feet<520?hint(10095,560,'Ride the board toward the right bank, then jump right. Space jumps.')
      :hint(swingX,500,'Wait for the swing to approach. D + Space jumps onto its board.');
  }
  if(x>=10350&&x<12050&&!run.hasDrawing){
    if(memory!=='treehouse')return fire(10520,'Remember the treehouse fire, then climb the three ledges with D + Space.');
    const next=feet>510?[10705,500]:feet>450?[10825,440]:feet>390?[10970,380]:[11145,380];
    return hint(...next,feet>390?'Jump right onto the next remembered ledge.':'E collects Eli’s drawing and his ember cup.');
  }
  if(x>=12000&&x<13650&&!run.canalGateOpen){
    if(memory!=='canal')return fire(12200,'Remember the canal fire. Climb the mill ledges to the wheel.');
    if(feet>500)return hint(12340,487,'Jump onto the mill’s lower stone ledge.');
    if(feet>450)return hint(12435,439,'Jump right onto the upper mill ledge.');
    return hint(12450,439,'Hold E at the wheel to secure a permanent canal crossing.');
  }
  if(run.eliFound&&!run.hasHearthEmber&&!run.rescuedEli){
    if(x>=13600)return hint(run.oldRoadOpen?13848:13760,560,run.oldRoadOpen?'E at the Old Road gate returns to the refuge. Then walk left to home.':'Hold E at the release beside the Old Road gate.');
    return hint(225,560,'Follow the secured paths left. E at your front door; remember the hearth upstairs.');
  }
  if(run.hasHearthEmber){
    const bell=RELAYS.find(r=>!run.litFinaleLamps[r.id]);
    if(bell){
      if(x<13600)return hint(4910,560,'The Old Road at the refuge leads straight back to the tower.');
      const fires={'tower-court':14000,'tower-base':14990,'tower-crown':16290};
      if(memory!==bell.regionId)return fire(fires[bell.regionId],'Remember this fire to restore the stairs. Climb to the bell, then hold E.');
      const stairs=bell.regionId==='tower-court'?A3.courtSteps:bell.regionId==='tower-base'?A3.baseSteps:[A3.crownLedge];
      const next=stairs.find(([left,right,y])=>feet>y+15&&x<right+30);
      return next?hint(Math.min(next[1]-25,next[0]+65),next[2],'Jump onto the next restored ledge. The bell is above.')
        :hint(bell.x,bell.floor,'Hold E beside the marked bell.');
    }
    if(!run.clearedEncounters['bell-warden'])return hint(A3.warden.x,560,'The Warden is unbound. Dodge its charge, then F during recovery; X draws your sword.');
    return hint(A3.eli,A3.gallery[2],'Climb the raised stairs to Eli. Hold E to give him the ember.');
  }
  if(run.rescuedEli)return !run.completedStory['view-platform']?hint(A3.view+20,345,'Walk right along the gallery with Eli to see the view.')
    :!run.completedStory['nia-eli']?hint(A3.oldRoadHome,560,'Drop safely to the landing. E at the Old Road takes you both to the refuge.')
      :hint(225,560,'Walk left to the family home. E at the door, then hold E beside the hearth.');
  const goal=run.goal;return hint(goal.x,goal.y,goal.text.replace(/^Act \d: /,''));
}
