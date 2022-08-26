import React, { useState, useContext, useEffect, useRef } from 'react';
import { StoreContext } from "../../context";

import styles from './index.css';

const FormInput = () => {
  const textRef = useRef(null);
  const { data, setData } = useContext(StoreContext);
  const [text, setText] = useState([]);
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [dataSelect, setDataSelect] = useState([]);
  const [infoPopup, setInfoPopup] = useState({});

  const el = (sel, par) => (par||document).querySelector(sel);
  const elPopup = el("#popup");

  useEffect(() => {
    let col = ""
    console.log(text)
    text.map((val) => (
      col += `<p>${val}</p>`
    ))
    setHtml(col);
  }, [text]);

  const getSeclection = () => {
    var lines = text.findIndex((val) => val.includes(window.getSelection().toString())) + 1;
    // console.log("row", window.getSelection());
      
    if(window.getSelection().toString() !== "") {
      setCount(count + 1);
      let start = window.getSelection().anchorOffset;
      let end = window.getSelection().focusOffset - 1;

      if(start > end) {
        start = window.getSelection().focusOffset;
        end = window.getSelection().anchorOffset-1;
      }
      setData((prev) => {
        return [
          ...prev,
          {
            lineNum: lines,
            selections: [
              {
                name:String.fromCharCode(65 + count),
                value: window.getSelection().toString(),
                start: start,
                end: end,
                type: "",
                regex: "",
                description: "",
              },
            ],
          },
        ];
      });

      setDataSelect((prev) => {
        return [
          ...prev,
          {
            lineNum: lines,
            name:String.fromCharCode(65 + count),
            value: window.getSelection().toString(),
            start: start,
            end: end,
            type: "",
            regex: "",
            description: "",
          }
        ]
      });

      hightlightText(); 
    }
  };
  const hightlightText = () => {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.setAttribute("style", "background-color: pink;");
    newNode.classList.add("highlight");
    range.surroundContents(newNode); 
  };

  const handleChange = (e) => {
    const { textContent } = e.currentTarget;
    let splitArray = textContent.split("\n");
    setText(splitArray);
  };
  
  const handleMouseMove = (e) => {
    const { offsetLeft, offsetTop, className, innerText } = e.target;
    setCoords({
      x: e.clientX + offsetLeft,
      y: e.clientY + offsetTop,
    });

    if (className === 'highlight') {
      Object.assign(elPopup.style, {
        left: `${offsetLeft + 20}px`,
        top: `${offsetTop + 20}px`,
        display: `block`
      });
      let index = data.map((dt) => dt.selections.filter((item) => item.value === innerText))
      console.log("index", index);
      // setInfoPopup(dataSelect[index]);
    } else {
      Object.assign(elPopup.style, {
        display: `none`
      })
    }
  }

  const handleChangePopup = (e) => {
    const { name, value } = e.target;
  }

  return (
    <>
      <pre
        id="editable"
        contentEditable="true"
        ref={textRef}
        onInput={(e) => handleChange(e)}
        style={{ width: "100%", height: "634px", border: '1px solid black', overflowY: "scroll", outline: 'none' }}
        onMouseUp={(e) => {getSeclection(e)}}
        onMouseMove={handleMouseMove}
      >
      </pre>
      <div id="popup" style={{ position: "absolute", width: "300px", height: "auto", padding: "10px", background: "gold", display: "none" }}>
        {/* <p>Value: {infoPopup?.value}</p>
        <p>Line number: {infoPopup?.lineNum}</p>
        <p>Start: {infoPopup?.start}</p>
        <p>End: {infoPopup?.end}</p> */}
        <hr />
        <div>
          <label>Type: </label>
          <select>
            <option value="One Word">One Word</option>
            <option value="Complete line">Complete line</option>
          </select>
        </div>
        <div>
          <label>Regex: </label>
          <input type="text" name="regex" onChange={handleChangePopup} />
        </div>
        <div>
          <label>Description: </label>
          <input type="text" name="description" onChange={handleChangePopup} />
        </div>
      </div>
    </>
  )
}

export default FormInput;