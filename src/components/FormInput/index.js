import React, { useState, useContext, useEffect, useRef } from "react";
import { uniqueId, forEach, round } from "lodash";
import { StoreContext } from "../../context";
import Tooltip from "../Tooltip";

import styles from "./style.module.css";

const FormInput = () => {
  const textRef = useRef("ABC");
  const { data, setData } = useContext(StoreContext);
  const { cliText, setCliText } = useContext(StoreContext);
  const { group, setGroup } = useContext(StoreContext);
  const [text, setText] = useState([]);
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [infoPopup, setInfoPopup] = useState({});
  const [values, setValues] = useState({
    type: "One Word",
    regex: "",
    desc: "",
    optional: "no",
    ignore: "no"
  });

  const el = (sel, par) => (par || document).querySelector(sel);
  const elPopup = el("#tooltip");

  let firstLineTopOffset = 29;
  let lineHeightOffset = 15;
  let charOffsetWidth = 7.8;

  useEffect(() => {
    let col = "";
    text.map((val) => (col += `<p>${val}</p>`));
    setHtml(col);
  }, [text]);

  const handleLineNumBlock = (blocks) => {
    let indexArr = [];
    for (let i = 0; i < text.length; i++) {
      for (let j = 0; j < blocks.length; j++) {
        if (text[i].includes(blocks[j])) {
          indexArr.push(i);
        }
      }
    }
    return indexArr;
  };


  const getSeclection = () => {
    let blocks = [];
    let lineNumStart = 0;
    let lineNumEnd = 0;
    // let lines = 1;
    let selID = 'id'+(Math.floor(1000 + Math.random() * 9000)).toString();
    // let lines = ((window.getSelection().offsetTop - firstLineTopOffset)/lineHeightOffset) + 1;
    // console.log('get line: ', lines);
    // console.log('selection', window.getSelection());
    // let lines = text.findIndex((val) => val.includes(window.getSelection().toString())) + 1;

    if (window.getSelection().toString() !== "") {
      if (window.getSelection) {
        let selectionRange = window.getSelection();
        if (selectionRange.rangeCount > 0) {
          let range = selectionRange.getRangeAt(0);
          let docFragment = range.cloneContents();
          let tmpDiv = document.createElement("div");
          tmpDiv.appendChild(docFragment);
          let selHTML = tmpDiv.textContent;

          console.log('Enable Group Selection', document.getElementById("groupSelect"));

          let splitArray = [];
          if (selHTML.includes("\r\n")) { splitArray = selHTML.split("\r\n");}
          else { splitArray = selHTML.split("\n");}
          blocks = splitArray;
          
          if (blocks.length > 1) {
            setGroup((prev) => [...prev, window.getSelection().toString()]);
            const indexArr = handleLineNumBlock(blocks);
            lineNumStart = indexArr.shift() + 1;
            lineNumEnd = indexArr.pop() + 1;
          }
        }
      }

      hightlightText(blocks, selID);

      console.log("get seletion:  ", document.getElementById(selID));
      let selectedStr = document.getElementById(selID);
      let lines = (selectedStr.offsetTop - firstLineTopOffset)/lineHeightOffset
      lines = round(lines) + 1;
      console.log('get line, ', lines);
      console.log('selectedStr.offsetLeft ', selectedStr.offsetLeft);
      console.log('selectedStr.offsetWidth ', selectedStr.offsetWidth);


      setCount(count + 1);
      // let start = window.getSelection().anchorOffset;
      // let end = window.getSelection().focusOffset - 1;
      let start;
      let end;
      if (blocks.length > 1) {
        start = window.getSelection().focusOffset;
        end = window.getSelection().anchorOffset - 1;
      } else {
        console.log('text of lines', text[lines - 1]);
        let startOffset = selectedStr.offsetLeft
        let widthOffset = selectedStr.offsetWidth

        // if (startOffset%2===0) {} else {startOffset=startOffset+3}

        start = round(startOffset/charOffsetWidth);
        end = start + window.getSelection().toString().length - 1;
      }
      

      
      // if (start > end) {
      //   start = window.getSelection().focusOffset;
      //   end = window.getSelection().anchorOffset - 1;
      // }

      
      setData((prev) => {
        console.log("prev", prev);
        if (blocks.length > 1) {
          return [
            ...prev,
            {
              lineStart: lineNumStart,
              lineEnd: lineNumEnd,
              isBlock: true,
              dictionary: [
                {
                  lineNum: lines,
                  selections: [
                    {
                      id: uniqueId("myprefix-"),
                      name: String.fromCharCode(65 + count),
                      value: window.getSelection().toString(),
                      start: start,
                      end: end,
                      type: "",
                      regex: "",
                      desc: "",
                      group: "",
                      optional: "no",
                      ignore: "no",
                    },
                  ],
                },
              ],
            },
          ];
        }
        return [
          ...prev,
          {
            lineNum: lines,
            selections: [
              {
                id: selID,
                name: `Sel${Math.floor(1000 + Math.random() * 9000)}`,
                value: window.getSelection().toString(),
                start: start,
                end: end,
                type: "",
                regex: "",
                desc: "",
                group: "",
                optional: "no",
                ignore: "no",
              },
            ],
          },
        ];
        
      });

      // hightlightText(blocks, selID);
    }
  };

  const hightlightText = (blocks, selID) => {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var newNode = document.createElement("span");
    if (blocks.length > 1) {
      newNode.setAttribute("style", "background-color: #fce0e5;");
      newNode.classList.add("block");
    } else {
      newNode.setAttribute("style", "background-color: pink;");
      newNode.classList.add("highlight");
      newNode.setAttribute("id", selID);  
      }
    range.surroundContents(newNode);
  };

  const handleChange = (e) => {
    const { textContent } = e.currentTarget;
    const element = document.createElement("a");
    const cli_output_text = new Blob([textContent], { type: "text/plain" });
    // var data = new FormData();
    //  data.append("file", cli_output_text);
    var file = new File([cli_output_text], "cli_output_text", {lastModified: new Date(),type: "text/plain"});
    console.log(file);
    setCliText(file);

    // element.href = URL.createObjectURL(file);
    // element.download = "myFile.txt";
    // element.click();
    console.log(cli_output_text);

    let splitArray = textContent.split("\n");
    setText(splitArray);
  };

  const handleMouseMove = (e) => {
    const { offsetLeft, offsetTop, className, innerText } = e.target;
    // var lineNum = text.findIndex((val) => val.includes(innerText)) + 1;
    setCoords({
      x: e.clientX + offsetLeft,
      y: e.clientY + offsetTop,
    });
    // console.log("offsetLeft: ", offsetLeft)
    // console.log("offsetTop: ", offsetTop)
    // console.log("clientY", document.getElementById('editable').clientY)
    // console.log("clientTop", document.getElementById('editable').clientTop)
    if (className === "highlight") {
      Object.assign(elPopup.style, {
        left: `${offsetLeft}px`,
        top: `${e.clientY - document.getElementById('editable').getBoundingClientRect().y + 28}px`,
        display: `block`,
      });

      let results;
      data.forEach ((dt) => {
        if (dt.selections[0].id === e.target.id) {results = dt};
      });

      // console.log('results ...', results);
      let lineNum = results.lineNum;
      let newArray = results.selections;

      setInfoPopup({ lineNum, ...newArray[0] });
      setValues({ ...newArray[0] });
    } else {
      Object.assign(elPopup.style, {
        display: `none`,
      });
    }
  };
  

  const handleChangePopup = (e, lineNum) => {
    const { name, value, id } = e.target;
    console.log("id: ", id)
    setData((prev) => {
      let indexSelection;
      let idx;
      // let index = prev.findIndex((dt) => dt.lineNum === lineNum);
      // indexSelection = prev[index].selections.findIndex((selection) =>
      //   selection.id.includes(id)
      // );
      // prev[index].selections[indexSelection] = {
      //   ...prev[index].selections[indexSelection],
      //   [name]: value,
      // };
      prev.forEach((dt, index) => {
        if (dt.lineNum === lineNum && dt.selections[0].id === id) {
          idx = index;
        }
      })
      prev[idx].selections[0] = {
        ...prev[idx].selections[0],
        [name]: value
      }
      return prev;
    });
    setValues({
      [name]: value,
    });
  };

  return (
    <>
      <pre
        className={styles.cliOutput}
        id="editable"
        contentEditable="true"
        ref={textRef}
        onInput={(e) => handleChange(e)}
        onMouseUp={(e) => {
          getSeclection(e);
        }}
        onMouseMove={handleMouseMove}
      ></pre>
      <Tooltip
        info={infoPopup}
        handleChangePopup={handleChangePopup}
        values={values}
      />
    </>
  );
};

export default FormInput;
