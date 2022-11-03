import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Switch } from "react-router-dom";
import { isEmpty } from "lodash";
import { StoreContext } from "./context.js";
import Highlight from "./components/Highlight";
import FormInput from "./components/FormInput";

import styles from "./App.module.css";


function App() {
  const [text, setText] = useState([]);
  const [html, setHtml] = useState("");
  const [json, setJson] = useState([]);
  const [group, setGroup] = useState([]);
  const [data, setData] = useState([]);
  const [python, setPython] = useState("");
  const [pythonError, setPythonError] = useState({});
  const [cliText, setCliText] = useState({});
  const [cliJson, setCliJson] = useState({});
  const [testParser, setTestParser] = useState("");
  const [testParserError, setTestParserError] = useState({});
  const [isDisabledGenerate, setIsDisabledGenerate] = useState(true);
  const [isDisabledTest, setIsDisabledTest] = useState(true);
  const [cliCommand, setCliCommand] = useState("");
  const [loadingTest, setLoadingTest] = useState(false);
  const [isDisabledReset, setIsDisabledReset] = useState(true);

  const myRef = React.createRef();

  const format = (e, test) => {
    e.preventDefault();
    console.log("data: ", data);
    let lines = test.map((item) => item.lineNum);
    let blocks = test.filter((item) => item.isBlock === true);

    let startLines = blocks.map((item) => item.lineStart);
    let endLines = blocks.map((item) => item.lineEnd);

    let uniqueLines = [...new Set(lines)];

    let uniqueSelections = [...new Set(test)];

    console.log("uniqueSelections: ", uniqueSelections)

    console.log("data test: ", test)

    let newTest = [];
    if (blocks.length > 0) {
      startLines.forEach((item, index) => {
        newTest.push({
          lineStart: item,
          lineEnd: endLines[index],
          isBlock: true,
          dictionary: [],
        });
      });
    }

    uniqueLines.forEach((item) => {
      if (item !== undefined) {
        newTest.push({
          lineNum: item,
          selections: [],
        });
      }
    });
  
    newTest.forEach((ele) => {
      // let newSelections = []
      let addedNames = []
      test.forEach((item) => {
        if (item.lineNum === ele.lineNum && item.isBlock === undefined) {
          
          if (ele.selections.length === 0) {
            ele.selections.push(item.selections);
            // newSelections.push(item.selections);
            addedNames.push(item.selections[0].name)
          }
          else {
            let flag = false;
            ele.selections?.forEach((sel) => {
              if (item.selections[0].start === sel[0].start || addedNames.includes(item.selections[0].name)) {
                flag = true;
              }
              
          })
          if (flag === false) {
            ele.selections.push(item.selections);
            // newSelections.push(item.selections);
            addedNames.push(item.selections[0].name)
          }
          }
          // ele.selections.push(item.selections);
        }
      });
    });

    test.forEach((item, index) => {
      newTest.forEach((ele) => {
        if (
          ele.lineStart <= item.lineNum &&
          ele.lineEnd >= item.lineNum &&
          ele.isBlock === true
        ) {
          if (checkString(item.selections[0].value)) {
            ele.dictionary.push(item);
            delete newTest[index];
          }
        }
      });
    });

    let temp = newTest.filter((el) => {
      return el !== null;
    });
    newTest = temp;

    // test.forEach((item) => {
    //   newTest.forEach((ele) => {
    //     if (ele.isBlock !== undefined) {
    //       if (item.lineStart <= ele.lineNum && item.lineEnd >= ele.lineNum) {
    //         console.log("dictionary: ", ele.dictionary);
    //         let newItem = ele.dictionary.flat(2);
    //         console.log("newItem: ", newItem);
    //       }
    //     }
    //   })
    // })

    // newTest.forEach((items) => {
    //   if (items.isBlock !== undefined) {
    //     let newItem = items.dictionary.flat(2);
    //     items.dictionary = newItem;
    //   } else {
    //     let newItem = items.selections.flat(2);
    //     items.selections = newItem;
    //   }
    // });

    newTest.forEach((items) => {
      if (items.isBlock === undefined) {
        let newItem = items.selections.flat(2);
        items.selections = newItem;
      }
    });

    setJson(JSON.stringify(newTest, undefined, 1));
    const element = document.createElement("a");
    const cli_output_json = new Blob([JSON.stringify(newTest)], {
      type: "application/json",
    });
    // var displayJsonData = JSON.stringify(newTest, undefined);
    // document.getElementById('jsonOutput').innerHTML = displayJsonData;
    // var data = new FormData();
    //  data.append("file", cli_output_text);
    var cliJson = new File([cli_output_json], "cli_output_json", {
      lastModified: new Date(),
      type: "application/json",
    });
    setCliJson(cliJson);
    // element.href = URL.createObjectURL(file);
    // console.log(element.href);
    // element.download = "myFile.json";
    // element.click();
    let formData = new FormData();
    formData.append("json_output_file", cliJson, "showversion.json");
    formData.append("cli_output_file", cliText, "showversion.txt");
    generatePy(formData);

    // exportData(newTest);
  };
  const testPy = (e) => {
    e.preventDefault();
    setLoadingTest(true)
    setTestParser("");
    setTestParserError({});
    let parserPy = new Blob([JSON.stringify(python)], {
      type: "text/plain",
    });
    let parserPyFile = new File([parserPy], "parser_file", {
      lastModified: new Date(),
      type: "text/plain",
    });

    console.log("parserPyFile", parserPyFile);
    console.log("cliJson", cliJson);
    console.log("cliText", cliText);

    let formData = new FormData();
    formData.append("parser_output_file", parserPyFile, "parser_N.py");
    formData.append("json_output_file", cliJson, "showversion.json");
    formData.append("cli_output_file", cliText, "showversion.txt");

    axios({
      url: `http://10.78.96.78:5001/api/test?cli_command=${cliCommand}`,
      method: "POST",
      data: formData,
    }).then((res)=>{
      console.log(res.data);
      setTestParser(JSON.stringify(res.data, undefined, 1))
    }).catch((err) => {
      const { message, name, code } = err;
      console.log("error: ", err);
      let testError = {
        code,
        message,
        name
      }
      setTestParserError(JSON.stringify(testError, undefined, 1));
    }).finally(() => {
      setLoadingTest(false);
    })
  };

  const generatePy = async (formData) => {
    try {
      setTestParser("");
      setPython("");
      setPythonError({});
      setTestParserError({});
      const { data, status } = await axios({
        url: `http://10.78.96.78:5001/api/parser?cli_command=${cliCommand}`,
        method: "POST",
        // headers: {
        //   "Access-Control-Allow-Origin": "No",
        //   "Content-Type": "multipart/form-data",
        // },
        data: formData,
      });
      if (status === 200) {
        setPython(data);
      }
    } catch (err) {
      console.log("error: ", err);
      const { message, name, code } = err;
      let testError = {
        code,
        message,
        name
      }
      setPythonError(JSON.stringify(testError, undefined, 1));
    }
  };
  function name(params) {
    return deleteFile();
  }

  const checkString = (str) => {
    return group.some((val) => val.includes(str));
  };

  async function deleteFile() {
    try {
      const response = await axios.get("http://localhost:3005/api/delete");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (cliCommand && !isEmpty(text)) {
      setIsDisabledGenerate(false);
    } else {
      setIsDisabledGenerate(true);
    }
    if (cliCommand && !isEmpty(json) && python) {
      setIsDisabledTest(false);
    } else {
      setIsDisabledTest(true);
    }
  }, [cliCommand, text, json, python])

  const handleChangeCLI = (e) => {
    const { value } = e.target;
    setCliCommand(value);
  };

  useEffect(() => {
    // if (isEmpty(text)) {
    //   setData([]);
    // } else if (isEmpty(html)) {
    //   setData([]);
    // }
    if (!isEmpty(json)) {
      setIsDisabledReset(false);
    }
  }, [json])

  const handleReset = () => {
    setHtml("");
    setText([]);
    setData([]);
    setJson([]);
    setPython("");
    setTestParser("");
    setPythonError({});
    setTestParserError({});
    document.getElementById("editable").textContent = ""
  }

  return (
    <BrowserRouter>
      <Switch>
        <StoreContext.Provider
          value={{
            data,
            setData,
            json,
            setJson,
            group,
            setGroup,
            cliText,
            setCliText,
            cliJson,
            setCliJson,
            testParser,
            setTestParser,
          }}
        >
          <div className="wrapper">
            <section className={styles.controlsSection}>
              <form className={styles.CLICommandForm}>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder="CLI command"
                    name="cliCommand"
                    className={styles.formControl}
                    onChange={handleChangeCLI}
                  />
                </div>
                <button className="btn-export" onClick={(e) => format(e, data)} disabled={isDisabledGenerate}>
                  Generate
                </button>
                <button className="btn-export" onClick={(e)=>testPy(e)} disabled={isDisabledTest}>
                  Test
                </button>
              </form>
            </section>
            <section className={styles.regexSection}>
              <div className={styles.regexLeft}>
                <div className={styles.cliOutput}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className={styles.regexLeftTitle}>CLI Output</h2>
                    <button className="btn-reset" onClick={handleReset} disabled={isDisabledReset}>
                      Reset
                    </button>
                  </div>
                  
                  <FormInput text={text} setText={setText} html={html} setHtml={setHtml} />
                </div>
                <div className="json" style={{ width: "100%", height: "100%" }}>
                  <h2 className="json-title">JSON</h2>
                  <textarea
                    className="export-json"
                    style={{ height: "300px", resize: "none", outline: "none" }}
                    value={json}
                    >
                  </textarea>
                </div>
              </div>
              <div className={styles.regexRight}>
                <Highlight 
                  python={python} 
                  setPython={setPython} 
                  testParser={testParser} 
                  testParserError={testParserError} 
                  pythonError={pythonError}
                  loadingTest={loadingTest} 
                />
              </div>
            </section>
          </div>
        </StoreContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
