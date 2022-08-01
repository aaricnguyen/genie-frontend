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

app.get('/api/check',(req,res)=>{
  do {
    
  } while (fs.existsSync('D:/data/sample.json')===false);
  res.send(fs.existsSync('D:/data/sample.json'));
})

app.get('/api/parser', (req, res) => {
//   res.send('Hello World!')
      // do {
      // } while (fs.existsSync("D:/data/sample.json")===false);
      // if (fs.existsSync('D:/data/sample.json')) {
      //   console.log("exists")
      // } else {
      //   console.log("not found");
      // }
      // fs.exists('D:/data/sample.json', (exists) => {
      //   console.log("exists", exists)
      // })
      // return new Promise((resolve, reject) => {
      //   exec('java -jar D:/data/com-0.0.1-SNAPSHOT.jar', (error, stdout, stderr) => {
      //     console.log("error", error);
      //     console.log("stdout", stdout);
      //     console.log("stderr", stderr);
      //     if (error) {
      //       console.error(`exec error: ${error}`);
      //       reject(error);
      //       return;
      //     }
      //     // console.log(`stdout: No. of directories = ${stdout}`);
      //     if (stderr!= "") {
      //       console.error(`stderr: ${stderr}`);
      //       reject(stderr)
      //       return;
      //     }
      //     resolve(stdout)
      //   });
      // })
      

//       setTimeout(() => {
        exec('java -jar D:/data/com-0.0.1-SNAPSHOT.jar', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: No. of directories = ${stdout}`);
          if (stderr!= "")
          console.error(`stderr: ${stderr}`);
res.send("Success");

        });
//       }, 3000);
        
          
        
        
      

      

//   res.response(result)
 
})
app.delete('/api/delete', async(req, res) => {
  //   res.send('Hello World!')
    // if(fs.existsSync("D:/data/parser.py")){
    //  fs.unlinkSync("D:/data/parser.py");
    // }
    // if(fs.existsSync("D:/data/sample.json")){
    //    fs.unlinkSync("D:/data/sample.json");
    // }
    // if(!fs.existsSync("D:/data/parser.py") && !fs.existsSync("D:/data/sample.json")){
    //   console.log("delete");
    //   res.send("Success Delete");
    // }
   
    var files = ['sample.json', 'parser.py'];
    const patch = 'D:/data/'
      if(fs.existsSync('D:/data/sample.json')){
        fs.unlink(`${patch}${files[0]}`, function(err) {
          if(err && err.code == 'ENOENT') {
            console.log("not exist");
            res.send(400, {message: `File doesn't exist`});
          } else if (err) {
            res.send(500, {message: `Error`});
          } else {
            fs.unlink(`${patch}${files[1]}`, function(err) {
            if(err && err.code == 'ENOENT') {
              res.send(400, {message: `File doesn't exist`});
            } else if (err) {
              res.send(500, {message: `Error`});
            } else {
              res.send(200, {message: `successful`});
            }
          });
        }
        })
      }else{
        res.send(200, {message: `successful`});

      }
  
    

});
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