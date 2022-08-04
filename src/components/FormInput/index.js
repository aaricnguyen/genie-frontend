import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from "../../context";

const FormInput = () => {
  const myRef = React.createRef();
  const { data, setData } = useContext(StoreContext);
  const [text, setText] = useState([]);
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let col = ""
    console.log(text)
    text.map((val) => (
      col += `<p>${val}</p>`
    ))
    setHtml(col);
  }, [text]);

  const getSeclection = () => {
    // let textVal = myRef.current;
    // console.log("textVal", textVal)
    var lines =
      text.findIndex(
        (val) => val.includes(window.getSelection().focusNode.nodeValue)
      ) + 1;
      // console.log("row", window.getSelection().focusNode.nodeValue);
      // console.log("row", window.getSelection());
      
    if(window.getSelection().toString() !== "") {
      setCount(count +1);
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
                name:String.fromCharCode(65+count),
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
    range.surroundContents(newNode); 
  };

  const handleChange = (e) => {
    console.log(e.currentTarget.textContent)
    const { textContent } = e.currentTarget;
    let splitArray = textContent.split("\n");
    setText(splitArray);
  };
  return (
    <div
      contentEditable="true"
      onInput={(e) => handleChange(e)}
      ref={myRef}
      value={text}
      style={{ width: "100%", height: "300px", border: '1px solid black', overflow: "scroll" }}
      onMouseUp={(e) => {getSeclection(e)}}
      dangerouslySetInnerHTML={{ __html: `<pre>${html}</pre>` }}
    ></div>
  )
}

export default FormInput;