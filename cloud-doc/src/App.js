import React from 'react';
import SimpleMDE from "react-simplemde-editor";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'


function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(valuse) => {console.log(valuse)}}
          />
          <FileList
            files={ defaultFiles }
            onFileClick={(id) => { console.log(id) }}
            onFileDelete={(id) => { console.log('delete', id) }}
            onSaveEdit={(id, newValue) => { console.log(id); console.log(newValue) }}
          />
          <div className="row no-gutters">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={ faPlus }
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={ faFileImport }
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          <TabList
            files={ defaultFiles }
            activeId="1"
            unsaveIds={["1", "2"]}
            onTabClick={(id) => { console.log(id) }}
            onCloseTab={(id) => { console.log(id) }}
          />
          <SimpleMDE
            value={ defaultFiles[1].body }
            onChange={(value) => { console.log(value) }}
            options={{
              minHeight: '515px',
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
