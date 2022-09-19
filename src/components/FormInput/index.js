import React, { useState, useContext, useEffect, useRef } from "react";
import { uniqueId, forEach, round } from "lodash";
import { StoreContext } from "../../context";
import Tooltip from "../Tooltip";
import GroupTooltip from "../GroupTooltip";

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
  const [idSelection, setIdSelection] = useState("");
  const [values, setValues] = useState({
    type: "One Word",
    name: "",
    group: "",
    regex: "",
    desc: "",
    optional: "no",
    ignore: "no"
  });
  const [infoGrpPopup, setGrpInfoPopup] = useState({});
  const [grpvalues, setGrpValues] = useState({
    name: "",
  });
  const [idGroupSelection, setIdGroupSelection] = useState("");

  const el = (sel, par) => (par || document).querySelector(sel);
  const elPopup = el("#tooltip");
  const grPopup = el("#grouptooltip");

  const getOperatingSystem = (window) => {
    let operatingSystem = 'Not known';
    if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
    if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
    if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
    if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }

    return operatingSystem;
  }

  const OS = (window) => {
    return getOperatingSystem(window);
  }

  console.log("OS: ", OS(window))

  // WIN
  let firstLineTopOffset = 31;
  let lineHeightOffset = 15;
  let charOffsetWidth = 7.2;

  /* MAC */
  if (OS(window) === 'MacOS') {
    console.log("IT'S WORK")
    firstLineTopOffset = 29;
    lineHeightOffset = 15;
    charOffsetWidth = 7.8;
  }

  useEffect(() => {
    let col = "";
    text.map((val) => (col += `<p>${val}</p>`));
    setHtml(col);
  }, [text]);

  const getSeclection = () => {
    let blocks = [];
    let lineNumStart = 0;
    let lineNumEnd = 0;
    // let lines = 1;
    let selID = 'id'+(Math.floor(1000 + Math.random() * 9000)).toString();
    let grpID = 'id'+(Math.floor(1000 + Math.random() * 9000)).toString();
    let tmpID = 'tmp'+(Math.floor(1000 + Math.random() * 9000)).toString();
    let tmpDiv;
    let isGroup;
    let isMultiLines;
    let isGrpDuplicated;
    let range;

    if (window.getSelection().toString() !== "") {
      if (window.getSelection) {
        let selectionRange = window.getSelection();
        if (selectionRange.rangeCount > 0) {
          range = selectionRange.getRangeAt(0);
          let docFragment = range.cloneContents();
          tmpDiv = document.createElement("span");
          tmpDiv.setAttribute('id', tmpID);
          tmpDiv.appendChild(docFragment);
          // range.surroundContents(tmpDiv);
          if (tmpDiv.textContent.includes("\n")) {isMultiLines = true};
          if (tmpDiv.childElementCount > 0) {isGroup = true};
          tmpDiv.childNodes.forEach((cld) => {
            console.log('child node', cld.className)
            if (cld.className==="groupselect") {return isGrpDuplicated = true}});
          console.log('isGrpDuplicated', isGrpDuplicated)
          console.log('isMultiLines', isMultiLines)

          // console.log('tmpDiv', tmpDiv)
          // console.log('tmpDiv offset top', tmpDiv.offsetTop)
          // console.log('tmpDiv offset left', tmpDiv.offsetLeft)
          // console.log('tmpDiv offset width', tmpDiv.offsetWidth)
          // console.log('tmpDiv offset high', tmpDiv.offsetHeight)
          // console.log('tmpDiv count child', tmpDiv.childElementCount)
          // console.log('tmpDiv child list', tmpDiv.childNodes)
        }
      }

      if (isGroup && isGrpDuplicated === undefined) {hightlightGroupSelected(tmpDiv, grpID, range)}
      else if (isMultiLines === undefined && isGrpDuplicated === undefined && isGroup === undefined) {
        hightlightTextSelected(tmpDiv, selID, range)}

      let start;
      let end;
      let lines;
      let grpChildIDList = [];

      if (isGroup && isGrpDuplicated === undefined) {
        tmpDiv.childNodes.forEach((chl) => {if (chl.className==="highlight") {grpChildIDList.push(chl.id)}});
        console.log("list of child", grpChildIDList);
      }
      else if (isMultiLines === undefined && isGrpDuplicated === undefined && isGroup === undefined) {
        console.log("get seletion:  ", document.getElementById(selID));
        let selectedStr = document.getElementById(selID);
        lines = round((selectedStr.offsetTop - firstLineTopOffset)/lineHeightOffset) +1;
        console.log('text of lines', text[lines - 1]);
        start = round(selectedStr.offsetLeft/charOffsetWidth);
        end = start + window.getSelection().toString().length - 1;
        // console.log('selectedStr.offsetLeft ', selectedStr.offsetLeft);
        // console.log('selectedStr.offsetWidth ', selectedStr.offsetWidth);  
      }

      // console.log('get line, ', lines);
      // console.log('start ', start);
      // console.log('end ', end);
      
      
      setData((prev) => {
        console.log("prev", prev);
        if (isGroup && isGrpDuplicated === undefined) {
          return [
            ...prev,
            { isGroup: isGroup,
              id: grpID,
              name: "",
              childIDList: grpChildIDList,
            },
          ];
        }
        else if (isMultiLines === undefined && isGrpDuplicated === undefined && isGroup === undefined) {
          return [
            ...prev,
            {
              isGroup: isGroup,
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
        }
        else {return [...prev]}
        
      });

      // hightlightText(blocks, selID);
    }
  };

  const hightlightTextSelected = (tmpDiv, selID, range) => {
    tmpDiv.setAttribute("style", "background-color: pink;");
    tmpDiv.classList.add("highlight");
    tmpDiv.setAttribute("id", selID);
    range.surroundContents(tmpDiv);
  };

  const hightlightGroupSelected = (tmpDiv, grpID, range) => {
    tmpDiv.setAttribute("style", "background-color: #fce0e5;");
    tmpDiv.classList.add("groupselect");
    tmpDiv.setAttribute("id", grpID);
    range.surroundContents(tmpDiv);
  };

  const removeHighlightTextSelected = (e, lineNum, id, isGroup = true, group) => {
    e.preventDefault();
    let unselect = document.getElementById(id);
    let pa = unselect.parentNode;
    while(unselect.firstChild) {
      pa.insertBefore(unselect.firstChild, unselect);
    }
    unselect.remove();
    removeSelection(lineNum, id, isGroup, group);
  }

  const removeSelection = (lineNum, id, isGroup, group) => {
    console.log("LINE NUM: ", lineNum)
    console.log("ID: ", id)
    console.log("data: ", data);
    const removed = data.filter((dt) => dt.selections[0]?.id !== id)
    console.log("removed: ", removed)
    if (!isGroup) {
      setData((prev) => {
        return [...prev.filter((dt) => dt.selections[0]?.id !== id)]
      })
    } else {
      
    }
    
    // if (flag) {
    //   setData((prev) => {
    //     let next;
    //     let find = prev.findIndex((val) => val.id === id && val.isGroup);
    //     if (find !== -1) {
    //       let deleted = prev.filter((dt) => dt.id !== id);
    //       next = deleted.map((dt) => dt.selections[0].group === "")
    //     }
    //     return next;
    //   })
    // }
  }

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
      console.log ("data", data);
      data.forEach ((dt) => {
        console.log ("is Group", dt.isGroup);
        if (dt.isGroup === undefined && dt.selections[0].id === e.target.id) {results = dt};
      });

      console.log('results ...', results);
      let lineNum = results.lineNum;
      let newArray = results.selections;

      console.log('line Num ...', results.lineNum);
      console.log('selection ...', results.selections);

      setInfoPopup({ lineNum, ...newArray[0] });
      setValues({ ...newArray[0]});
    } 
    else if (className === "groupselect") {
      Object.assign(grPopup.style, {
        left: `${offsetLeft+15}px`,
        top: `${e.clientY - document.getElementById('editable').getBoundingClientRect().y+28}px`,
        display: `block`,
      });
      let results;
      data.forEach ((dt) => {
        if (dt.isGroup && dt.id === e.target.id) {results = dt};
      });

      console.log('results ...', results);
      // let lineNum = results.lineNum;
      if (results !== undefined) {
        let newArray = results;
        let name = results.name;

        setGrpInfoPopup({name, ...newArray});
        setGrpValues({...newArray});
      }
    }
    else
    {
      if (elPopup) {
        Object.assign(elPopup.style, {
          display: `none`,
        });
      }

      if (grPopup) {
        Object.assign(grPopup.style, {
          display: `none`,
        });
      }
      
    }
  };

  const handleSubmitTooltip = (e, lineNum) => {
    e.preventDefault();
    setData((prev) => {
      let idx;
      prev.forEach((dt, index) => {
        if (dt.isGroup === undefined && dt.lineNum === lineNum && dt.selections[0].id === idSelection) {
          idx = index;
        }
      })
      prev[idx].selections[0] = {
        ...prev[idx].selections[0],
        ...values
      }
      return prev;
    });
  }
  

  const handleChangePopup = (e) => {
    const { name, value, id } = e.target;
    setIdSelection(id);
    setValues({
      [name]: value,
    });
  };

  const handleSubmitGroupTooltip = (e) => {
    e.preventDefault();
    let childIDList = [];
    setData((prev) => {
      let idx;
      prev.forEach((dt, index) => {
        if (dt.isGroup && dt.id === idGroupSelection) {
          idx = index;
          childIDList = dt.childIDList;
        }
      })
      prev[idx] = {
        ...prev[idx],
        ...grpvalues,
      }
      return prev;
    });

    data.forEach((dt) => { if (dt.isGroup === undefined && childIDList.includes(dt.selections[0].id)) {
      dt.selections[0].group = grpvalues.name
      }
    });
  }

  const handleGroupChangePopup = (e) => {
    const {name, value, id} = e.target;
    console.log("id: ", id);
    console.log("value:    ", value);
    setIdGroupSelection(id);
    setGrpValues({
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
        handleSubmitTooltip={handleSubmitTooltip}
        removeHighlightTextSelected={removeHighlightTextSelected}
        values={values}
      />
      <GroupTooltip
        info={infoGrpPopup}
        handleGroupChangePopup={handleGroupChangePopup}
        handleSubmitGroupTooltip={handleSubmitGroupTooltip}
        removeHighlightTextSelected={removeHighlightTextSelected}
        values={grpvalues}
      />
    </>
  );
};

export default FormInput;
