'use client'

import { useState,  useRef } from "react"
import html2canvas from "html2canvas"


export default function Main() {
  const canvasRef = useRef(null),
        canvasContainerRef = useRef(null),
        downloadRef = useRef(null),
        [text, setText] = useState(""),
        [isImageLoaded, setImageLoaded] = useState(false)
      
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

  function handleTextChange(e){
    setText(e.target.value)
  }

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
      <div className="col-span-1">
       <div className="w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white">
        <div className="flex flex-col p-12 gap-2">
        {isImageLoaded && 
        <button className="border" onClick={handleDownload}>Download</button>
        }
        <input id="open-file" type="file" accept="image/png, image/jpeg" onChange={drawCanvas}></input>
        <p>Input</p>
        <textarea id="input-text" onChange={handleTextChange} className="border"></textarea>
        {/* <p>Position</p>
        <select name="position" id="position-select" className="border">
          <option value="">--Please choose an option--</option>
          <option value="top">Atas</option>
          <option value="middle">Tengah</option>
          <option value="bottom">Bawah</option>
        </select> */}
        <p>Enlarge</p>
        <input id="opacity" name="opacity-range" type="range" min="0" max="100" className="border"></input>
        <p>Opacity/Transparency</p>
        <input id="opacity" name="opacity-range" type="range" min="0" max="100" className="border"></input>
        
        {/* <p>Rotate</p> */}
        <div className="flex flex-row gap-2">
        {/* <button className="border rounded-full p-1">90 CCW</button>
        <button className="border rounded-full p-1">90 CW</button>
        <button className="border rounded-full p-1">45 CCW</button>
        <button className="border rounded-full p-1">45 CW</button> */}
        </div>
       </div>
       </div>
      </div>
      <div className="col-span-3">
      <div ref={canvasContainerRef} className="flex justify-center w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white static">
        <div id="download-ref" ref={downloadRef}> 
          <p id="draggable-text" className="absolute">{text}</p>
          <canvas id="canvas"  ref={canvasRef}></canvas>
        </div>
       </div>
      </div>
      </div>
    </main>
  )
}
