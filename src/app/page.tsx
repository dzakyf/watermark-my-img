'use client'

import { useState,  useRef, useEffect } from "react"
import html2canvas from "html2canvas"


export default function Main() {
  const canvasRef = useRef(null),
        canvasContainerRef = useRef(null),
        downloadRef = useRef(null),
        dragableTextRef = useRef(null),
        [text, setText] = useState(""),
        [isImageLoaded, setImageLoaded] = useState(false),
        [offSet,setOffset] = useState([0,0]),
        [isSetToMove, setToMove] = useState(false)
      
  function drawCanvas(e){
    setText("")
    setImageLoaded(true)
    const file = e.target.files[0],
          fileSrc = URL.createObjectURL(file),
          canvas = canvasRef.current,
          context = canvas.getContext('2d'),
          container = canvasContainerRef.current,
          img = new Image()
    
    img.src = fileSrc 
    img.onload = function (){
      const hImg = img.height,
            wImg = img.width,
            wContainer = container.offsetWidth,
            hContainer = container.offsetHeight

      //get ratio canvas:img, this will be used 
      //for calculating image and container width so that it 
      //will fit to container 
      let ratio = Math.min((hContainer/hImg),(wContainer/wImg))

      // resize canvas based on ratio   
      canvas.height = hContainer
      canvas.width = wImg*ratio 
      
      // paint to canvas 
      context.drawImage(img,0,0, wImg, hImg, 0,0, wImg*ratio, hImg*ratio)

    }
  }

  function handleMouseUp(e){
    setToMove(false)
  }

  function handleMouseMove(e){
    if(isSetToMove){
      let mousePosition = {
        x : e.clientX,
        y: e.clientY
      }

      dragableTextRef.current.style.left = `${mousePosition.x - offSet[0]}px`
      dragableTextRef.current.style.top = `${mousePosition.y - offSet[1]}px`
    }
  }
  
  function handleMouseDown(e){
    let currentPosition = dragableTextRef.current.getBoundingClientRect()
    let currentLeft = e.clientX - currentPosition.left
    let currentTop = e.clientY - currentPosition.top
    setOffset([currentLeft , currentTop])
    setToMove(true)
    console.dir(dragableTextRef.current)
  } 


  function enlargeText(e){
    dragableTextRef.current.style.fontSize = `${e.target.value}px`
  }

  function setTextOpacity(e){
    dragableTextRef.current.style.opacity = e.target.value/100
  }

  function handleTextChange(e){
    setText(e.target.value)
  }

  function handleColorChange(e){
    dragableTextRef.current.style.color = e.target.value
  }

  // TBD: get current rotation on text and use it later 
  // let currentDegree = 0
  // function handleRotateText(e){
  //   currentDegree += parseInt(e.target.dataset.angle)
  //   console.log(dragableTextRef.current.style.transform)

  // }

  function handleDownload(){
    let fileName = "res"

    html2canvas(downloadRef.current).then(function(canvas){
      const downloadLink = document.createElement('a')
      downloadLink.download = fileName
      downloadLink.href = canvas.toDataURL("image/png;base64") 
      downloadLink.click()
    })
  }


  return (
    <main className="grid min-h-screen">
      <div className="grid grid-cols-4 gap-4 p-36">
        <div className="col-span-3">
          <div ref={canvasContainerRef} className="flex justify-center w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white static ">
            <div id="download-ref" ref={downloadRef}> 
              <p id="draggable-text" ref={dragableTextRef} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} className="absolute cursor-default ">{text}</p>
              <canvas id="canvas"  ref={canvasRef}></canvas>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white">
            <div className="flex flex-col p-8 gap-2">
            {isImageLoaded && 
            <button className="border" onClick={handleDownload}>Download</button>
            }
            <input id="open-file" type="file" accept="image/png, image/jpeg" onChange={drawCanvas}></input>
            <p>Input</p>
            <div className="flex gap-2">
              <textarea id="input-text" onChange={handleTextChange} className="border flex-auto"></textarea> 
              <input type="color" className="border" onChange={handleColorChange}></input>
            </div>
            <p>Text Size</p>
            <input id="enlarge-text" name="enlarge-text" type="range" min="0" max="100" className="border" onChange={enlargeText}></input>
            <p>Opacity/Transparency</p>
            <input id="opacity" name="opacity-range" type="range" min="0" max="100" step="10" className="border" onChange={setTextOpacity}></input>
            
            {/* <p>Rotate</p> */}
            {/* <div className="flex flex-row gap-2">
            <button id="rotate-90-ccw"className="border rounded-full p-1 hover:bg-gray-200" data-angle="-90" onClick={handleRotateText}>90 CCW</button>
            <button id="rotate-90-cw" className="border rounded-full p-1 hover:bg-gray-200" data-angle="90" onClick={handleRotateText}>90 CW</button>
            <button className="border rounded-full p-1 hover:bg-gray-200" data-angle="45">45 CCW</button>
            <button className="border rounded-full p-1 hover:bg-gray-200" data-angle="-45">45 CW</button>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
