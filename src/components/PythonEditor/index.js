import React from "react";
import AceEditor from "react-ace";

const PythonEditor = (props) => {
  const { python, onChange } = props;
  // function onChange(newValue) {
  //   console.log("change", newValue);
  // }
  return (
    <AceEditor 
      {...props}
      theme="twilight"
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      value={python}
      onChange={onChange}
    />
  )
}

export default PythonEditor;