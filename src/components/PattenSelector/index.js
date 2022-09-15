import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context";

const PattenSelector = ({ text }) => {
  const { data, setData } = useContext(StoreContext);
  const [html, setHtml] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let col = "";
    console.log(text);
    text.map((val) => {
      col += `<p>${val}</p>`;
    });
    setHtml(col);
  }, [text]);

  const getSeclection = () => {
    console.log("adasdasdsa");
    var lines =
      text.findIndex((val) =>
        val.includes(window.getSelection().focusNode.nodeValue)
      ) + 1;
    console.log(window.getSelection().focusNode.nodeValue);

    if (window.getSelection().toString() !== "") {
      setCount(count + 1);
      let start = window.getSelection().anchorOffset;
      let end = window.getSelection().focusOffset - 1;
      console.log(start);
      if (start > end) {
        start = window.getSelection().focusOffset;
        end = window.getSelection().anchorOffset - 1;
      }
      console.log(start);
      setData((prev) => {
        return [
          ...prev,
          {
            lineNum: lines,
            selections: [
              {
                name: String.fromCharCode(65 + count),
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
  return (
    <>
      <h3>Pattern Selector</h3>
      <div
        className="content"
        id="p"
        style={{ width: "100%", height: "300px", overflow: "scroll" }}
        onMouseUp={(e) => getSeclection(e)}
        dangerouslySetInnerHTML={{ __html: `<pre>${html}</pre>` }}
      >
        {console.log(data)}
      </div>
    </>
  );
};
export default PattenSelector;
