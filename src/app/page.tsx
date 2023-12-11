'use client'

import { useState,  useRef, MutableRefObject } from "react"
import html2canvas from "html2canvas"


export default function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null),
        canvasContainerRef = useRef<HTMLDivElement>(null),
        downloadRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>,
        dragableTextRef = useRef<HTMLParagraphElement>(null) as MutableRefObject<HTMLParagraphElement>,
        [text, setText] = useState<string>(""),
        [isImageLoaded, setImageLoaded] = useState<boolean>(false),
        [offSet,setOffset] = useState<Array<number>>([0,0]),
        [isSetToMove, setToMove] = useState<boolean>(false)
      
  function drawCanvas(e : any){
    setText("")
    setImageLoaded(true)
    const file : File = e.target.files[0],
          fileSrc : string = URL.createObjectURL(file),
          canvas : any = canvasRef.current,
          context : any = canvas.getContext('2d'),
          container : any = canvasContainerRef.current,
          img : HTMLImageElement = new Image()
    
    img.src = fileSrc 
    img.onload = function (){
      const hImg : number = img.height,
            wImg : number = img.width,
            wContainer : number = container.offsetWidth,
            hContainer : number = container.offsetHeight

      //get ratio canvas:img, this will be used 
      //for calculating image and container width so that it 
      //will fit to container 
      let ratio : number = Math.min((hContainer/hImg),(wContainer/wImg))

      // resize canvas based on ratio   
      canvas.height = hContainer
      canvas.width = wImg*ratio 
      
      // paint to canvas 
      context.drawImage(img,0,0, wImg, hImg, 0,0, wImg*ratio, hImg*ratio)

    }
  }

  function handleMouseUp(){
    setToMove(false)
  }

  function handleMouseMove(e : React.MouseEvent<HTMLParagraphElement, MouseEvent>){
    if(isSetToMove){
      let mousePosition : {x: number, y:number} = {
        x : e.clientX,
        y: e.clientY
      }

      dragableTextRef.current.style.left = `${mousePosition.x - offSet[0]}px`
      dragableTextRef.current.style.top = `${mousePosition.y - offSet[1]}px`
    }
  }
  
  function handleMouseDown(e : React.MouseEvent<HTMLParagraphElement, MouseEvent>){
    let currentPosition : DOMRect = dragableTextRef.current.getBoundingClientRect()
    let currentLeft : number = e.clientX - currentPosition.left
    let currentTop : number = e.clientY - currentPosition.top
    setOffset([currentLeft , currentTop])
    setToMove(true)
  } 


  function enlargeText(e: React.ChangeEvent<HTMLInputElement>){
    dragableTextRef.current.style.fontSize = `${e.target.value}px`
  }

  function setTextOpacity(e: React.ChangeEvent<HTMLInputElement>){
    dragableTextRef.current.style.opacity = `${Number(e.target.value)/100}`
  }

  function handleTextChange(e: any){
    setText(e.target.value)
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>){
    dragableTextRef.current.style.color = e.target.value
  }

  // TBD: get current rotation on text and use it later 
  // let currentDegree = 0
  // function handleRotateText(e){
  //   currentDegree += parseInt(e.target.dataset.angle)
  //   console.log(dragableTextRef.current.style.transform)

  // }

  function handleDownload(){
    let fileName : string = "res"

    html2canvas(downloadRef.current).then(function(canvas){
      const downloadLink : HTMLAnchorElement= document.createElement('a')
      downloadLink.download = fileName
      downloadLink.href = canvas.toDataURL("image/png;base64") 
      downloadLink.click()
    })
  }


  return (
    <main className="sm:grid lg:flex min-h-screen lg:justify-center">
      <div className="sm:grid sm:grid-cols-1 lg:flex lg:justify-center gap-4 lg:p-36">
        <div className="sm:grid-cols-1 sm:px-2 lg:w-[42rem]">
          <div ref={canvasContainerRef} className="flex justify-center  w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white static ">
            <div id="download-ref" ref={downloadRef}> 
              <p id="draggable-text" ref={dragableTextRef} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} className="absolute cursor-default whitespace-normal break-words">{text}</p>
              <canvas id="canvas"  ref={canvasRef}></canvas>
            </div>
          </div>
        </div>
        <div className="sm:grid-cols-1 sm:px-2">
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
