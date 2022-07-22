const express = require('express')
var cors = require('cors');
const app = express()
const port = 3005

const { exec } = require('child_process');
const { stdout } = require('process');
const fs = require('fs');
  
app.use(cors())
// Counts the number of directory in 
// current working directory


app.get('/api/parser', async(req, res) => {
//   res.send('Hello World!')
      // do {
      // } while (fs.existsSync("D:/data/sample.json")===false);
     
     
          exec(' java -jar D:/data/com-0.0.1-SNAPSHOT.jar', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: No. of directories = ${stdout}`);
            if (stderr!= "")
            console.error(`stderr: ${stderr}`);
          });
          
        
        
      

      
res.send("Success");

//   res.response(result)
 
})
app.get('/api/delete', async(req, res) => {
  //   res.send('Hello World!')
    if(fs.existsSync("D:/data/parser.py")){
     fs.unlinkSync("D:/data/parser.py");
    }
    if(fs.existsSync("D:/data/sample.json")){
       fs.unlinkSync("D:/data/sample.json");
    }
    if(!fs.existsSync("D:/data/parser.py") && !fs.existsSync("D:/data/sample.json")){
      console.log("delete");
      res.send("Success Delete");
    }
   
        
  // res.send("Success Delete");
  
  //   res.response(result)
   
  })
app.get('/api/python', (req, res) => {

    // do {
    //   setTimeout(() => {
        
    //   }, 2000);
    // }while(!fs.existsSync("D:/data/parser.py"))
    fs.readFile('D:/data/parser.py', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data)
        // res.response(data)
        res.send(data)
      });
     
     
    })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})