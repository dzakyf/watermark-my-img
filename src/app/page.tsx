'use client'

export default function Main() {
  console.dir(document)

  return (
    <main className="grid min-h-screen">
      <div className="grid grid-cols-4 gap-4 p-36">
      <div className="col-span-1">
       <div className="w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white">
        <div className="flex flex-col p-12 gap-2">
        <input id="open-file" type="file"></input>
        <p>Input</p>
        <textarea className="border"></textarea>
        <p>Position</p>
        <select name="position" id="position-select" className="border">
          <option value="">--Please choose an option--</option>
          <option value="top">Atas</option>
          <option value="middle">Tengah</option>
          <option value="bottom">Bawah</option>
          {/* <option value="top">Atas</option>
          <option value="middle">Tengah</option>
          <option value="bottom">Bawah</option> */}
        </select>
        <p>Opacity</p>
        <input id="opacity" name="opacity-range" type="range" min="0" max="100" className="border"></input>
        <p>Zoom</p>
        <input id="opacity" name="opacity-range" type="range" min="0" max="100" className="border"></input>
        <p>Rotate</p>
        <div className="flex flex-row gap-2">
        <button className="border rounded-full p-1">90 CCW</button>
        <button className="border rounded-full p-1">90 CW</button>
        <button className="border rounded-full p-1">45 CCW</button>
        <button className="border rounded-full p-1">45 CW</button>
        </div>
       </div>
       </div>
      </div>
      <div className="col-span-3">
       <div className="w-full h-[36rem] shadow-lg pb-full rounded-xl bg-white">
       </div>
      </div>
      </div>
    </main>
  )
}
