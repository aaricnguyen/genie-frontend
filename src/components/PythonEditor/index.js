import React from "react";
import AceEditor from "react-ace";

const PythonEditor = (props) => {
  const { python, handleChangePython = () => {} } = props;
  return (
    <AceEditor 
      {...props}
      theme="twilight"
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      value={python}
      onChange={handleChangePython}
    />
  )
}

export default PythonEditor;