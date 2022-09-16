import React, { useState, useContext, useEffect, useRef } from "react";
import { uniqueId } from "lodash";
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
    let lines = text.findIndex((val) => val.includes(window.getSelection().toString())) + 1;

    if (window.getSelection().toString() !== "") {
      if (window.getSelection) {
        let selectionRange = window.getSelection();
        if (selectionRange.rangeCount > 0) {
          let range = selectionRange.getRangeAt(0);
          let docFragment = range.cloneContents();
          let tmpDiv = document.createElement("div");
          tmpDiv.appendChild(docFragment);
          let selHTML = tmpDiv.textContent;
          let splitArray = []
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
      setCount(count + 1);
      // let start = window.getSelection().anchorOffset;
      // let end = window.getSelection().focusOffset - 1;
      let start;
      let end;
      if (blocks.length > 1) {
        start = window.getSelection().focusOffset;
        end = window.getSelection().anchorOffset - 1;
      } else {
        start = text[lines - 1].indexOf(getSelection());
        end = start + window.getSelection().toString().length - 1;
      }
      

      
      // if (start > end) {
      //   start = window.getSelection().focusOffset;
      //   end = window.getSelection().anchorOffset - 1;
      // }
      setData((prev) => {
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
        ];
      });

      hightlightText(blocks);
    }
  };
  const hightlightText = (blocks) => {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var newNode = document.createElement("span");
    if (blocks.length > 1) {
      newNode.setAttribute("style", "background-color: #fce0e5;");
      newNode.classList.add("block");
    } else {
      newNode.setAttribute("style", "background-color: pink;");
      newNode.classList.add("highlight");
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
    var lineNum = text.findIndex((val) => val.includes(innerText)) + 1;
    setCoords({
      x: e.clientX + offsetLeft,
      y: e.clientY + offsetTop,
    });

    if (className === "highlight") {
      Object.assign(elPopup.style, {
        left: `${offsetLeft + 5}px`,
        top: `${offsetTop + 10}px`,
        display: `block`,
      });
      let results = data.map((dt) => {
        if (dt.isBlock === undefined) {
          const { selections } = dt;
          return selections.find((item) => item.value.includes(innerText));
        }
      });
      let newArray = results.filter((result) => result !== undefined);
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
    setData((prev) => {
      let indexSelection;
      let index = prev.findIndex((dt) => dt.lineNum === lineNum);
      indexSelection = prev[index].selections.findIndex((selection) =>
        selection.id.includes(id)
      );
      prev[index].selections[indexSelection] = {
        ...prev[index].selections[indexSelection],
        [name]: value,
      };
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
