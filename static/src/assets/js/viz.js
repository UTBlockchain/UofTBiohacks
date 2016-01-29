import d3 from 'd3'
import PIXI from 'pixi.js'

/**
 * Voronoi graph as an illustration of dividing cells.
 * @param  {string} id the id of the dom element to append the renderer into
 * @return {none}    just calls render() at the end
 */
export default function(id) {
  // ==== PIXI renderer ====
  const W = window.innerWidth
  const H = window.innerHeight
  const renderer = new PIXI.autoDetectRenderer(W, H, { transparent: true, antialias: true })
  document.getElementById(id).appendChild(renderer.view)

  // PIXI stage and graphics child
  let stage = new PIXI.Container()
  let graphics = new PIXI.Graphics()
  stage.addChild(graphics)

  // ==== Nodes ====
  const numFactor = 10000
  const numNodes = Math.floor(W * H / numFactor)
  let nodes = Array(numNodes).fill().map( (_, i) => ({
    x: Math.floor(Math.random()*W),
    y: Math.floor(Math.random()*H),
    radius: 20 + Math.floor(Math.random()*10-5)
  }))

  // ==== Force ====
  const charge = -700
  let force = d3.layout.force()
    .nodes(nodes)
    // .links(links)
    .size([W, H])
    .linkStrength(0.1)
    .friction(0.9)
    .linkDistance(50)
    .charge(charge)
    .gravity(0.1)
    .theta(0.8)
    .alpha(0.1)
    // .start()

  force.start()
  for (var i = 0; i < nodes.length; ++i) {
    force.tick()
  }
  force.stop()

  // ==== Voronoi ====
  const voronoi = d3.geom.voronoi()
    .x(d => d.x)
    .y(d => d.y)

  // ==== Render ====
  const draw = () => {
    graphics.clear()

    const path = voronoi(nodes)
    graphics.lineStyle(2, 0xffffff, 1)
    for (let i=0; i < path.length; i++) {
      const p = path[i]

      // Midpoint between first and last points
      const cX = (p[0][0] + p[p.length-1][0]) / 2
      const cY = (p[0][1] + p[p.length-1][1]) / 2
      graphics.moveTo(cX, cY)

      // Generate a midpoint between p0-p1, p1-p2, pn-pm,
      // until pm is the last point
      // draw quadratic curve using pj as the control and
      // the midpoint as the endpoint
      for (let j=0; j < p.length - 1; j++) {
        const mpX = (p[j][0] + p[j+1][0]) / 2
        const mpY = (p[j][1] + p[j+1][1]) / 2

        graphics.quadraticCurveTo(p[j][0], p[j][1], mpX, mpY)
      }

      // Complete the shape with curve from midpoint of pn-pm,
      // using pm (last point) as control, to cX,cY
      graphics.quadraticCurveTo(p[p.length-1][0], p[p.length-1][1], cX, cY)
    }

    const links = voronoi.links(nodes)
    graphics.lineStyle(2, 0xffffff, 0.1)
    for (let i=0; i < links.length; i++) {
      const { source, target } = links[i]

      graphics.moveTo(source.x, source.y)
      graphics.lineTo(target.x, target.y)
    }


    graphics.lineStyle(0)
    // graphics.lineStyle(2, 0x578ed6, 1)
    graphics.beginFill(0xffffff, 0.5)
    for (let i=0; i < nodes.length; i++) {
      const { x, y, radius } = nodes[i]

      graphics.drawCircle(x, y, radius)
    }
  }

  const render = () => {
    draw()
    renderer.render(stage)
    requestAnimationFrame(render)
  }

  // render()
  draw()
  renderer.render(stage)
}