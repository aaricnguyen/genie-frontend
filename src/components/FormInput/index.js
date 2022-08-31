import React, { useState, useContext, useEffect, useRef } from 'react';
import { uniqueId } from 'lodash';
import { StoreContext } from "../../context";
import Tooltip from '../Tooltip';

import styles from './style.module.css'

const FormInput = () => {
  const textRef = useRef(null);
  const { data, setData } = useContext(StoreContext);
  const [text, setText] = useState([]);
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [infoPopup, setInfoPopup] = useState({});
  const [values, setValues] = useState({
    type: 'One Word',
    regex: '',
    description: ''
  })

  const el = (sel, par) => (par || document).querySelector(sel);
  const elPopup = el("#tooltip");

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
                id: uniqueId('myprefix-'),
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
    var lineNum = text.findIndex((val) => val.includes(innerText)) + 1;
    setCoords({
      x: e.clientX + offsetLeft,
      y: e.clientY + offsetTop,
    });

    if (className === 'highlight') {
      Object.assign(elPopup.style, {
        left: `${offsetLeft + 10}px`,
        top: `${offsetTop + 15}px`,
        display: `block`
      });
      let results = data.map((dt) => {
        const { selections } = dt;
        return (
          selections.find((item) => item.value.includes(innerText))
        )
      });
      let newArray = results.filter((result) => result !== undefined);
      setInfoPopup({lineNum, ...newArray[0]});
      setValues({...newArray[0]})
    } else {
      Object.assign(elPopup.style, {
        display: `none`
      })
    }
  }

  const handleChangePopup = (e, lineNum) => {
    const { name, value, id } = e.target;
    setData((prev) => {
      let indexSelection;
      let index = prev.findIndex((dt) => dt.lineNum === lineNum);
      indexSelection = prev[index].selections.findIndex((selection) => selection.id.includes(id));
      prev[index].selections[indexSelection] = {...prev[index].selections[indexSelection], [name]: value}
      return prev;
    })
    setValues({
      [name]: value
    })
  }

  return (
    <>
      <pre
        className={styles.cliOutput}
        id="editable"
        contentEditable="true"
        ref={textRef}
        onInput={(e) => handleChange(e)}
        onMouseUp={(e) => {getSeclection(e)}}
        onMouseMove={handleMouseMove}
      >
      </pre>
      <Tooltip info={infoPopup} handleChangePopup={handleChangePopup} values={values} />
    </>
  )
}

export default FormInput;