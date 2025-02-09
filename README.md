# CAD-exercise
## Set up and run 
You could run the porject on you local machine following these simple steps:
- Clone the github repo
- install the dependencies `npm i`
- run the local server `npm run dev`
- open the page in your [localhost](http://localhost:5173/)

## Deployed version
There is a deployed version of the exercise at this [link](https://cad-exercise.netlify.app/)

## References
While Developing the exercise I have searched online for examples or documentations, these are the links I used the most:
- [ArcGis rest API for map](https://developers.arcgis.com/rest/services-reference/enterprise/map-service/)  
- [Example](https://hofk.de/main/discourse.threejs/2019/WallBuilding/WallBuilding.html)
- [ExtrudeGeometry doc](https://threejs.org/docs/index.html#api/en/geometries/ExtrudeGeometry)
- [Three.js doc](https://threejs.org/docs)
- [Remove object from scene](https://stackoverflow.com/questions/18357529/threejs-remove-object-from-scene)

## Enhancements
Here is a list of improvements I thought of but was unable to implement due to lack of time:
- Draw lines while moving the mouse (instead of create the line once two points are drawn)
- Unify two close point. If a point of the polygon is really close to the first one, maybe it means the user is trying to close the polygon shape. So it could be interesting 
to unify the latest point with the first one and automatically close the polygon, stop the drawing phase and allow the user to set up the walls' height.
- Better debugging the reason why sometimes lines are not so visible
- Improve the controls mask: hide it while I am working on the plane, and show it only when I wanna do something on the map plane. Also enable and disable some feature dynamically (prevent the user to be able to set up the wall height if they haven't draw any shapes yet)
- Try to understand how measurement units are handled and give a reasonable px height to the walls based on the scale of the maps and the height I wrote in the number input.

## Prompt
I haven't used LLMs and copilot a lot, since with Three.js they are not so trained and often they give me really wrong answer, but I tried to leave the prompt I used in the code comments inside the files.