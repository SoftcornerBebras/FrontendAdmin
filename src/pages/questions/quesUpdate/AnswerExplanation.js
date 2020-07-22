import { render } from 'react-dom';
import * as React from 'react';
import { FormHelperText } from '@material-ui/core'
import { addClass, removeClass, Browser } from '@syncfusion/ej2-base';
import { RichTextEditorComponent, Toolbar, Inject, Image, Link, HtmlEditor, Count, QuickToolbar, Table } from '@syncfusion/ej2-react-richtexteditor';
import { createElement } from '@syncfusion/ej2-base';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
 import './rteCSS.css';
import { quesString } from "./Review";

export function setAnsExp() {
      let x = document.getElementsByClassName('control-section')[0].outerHTML
      let posStart=x.indexOf('e-rte-content')
      let posEnd = x.indexOf('e-rte-character-count')
      posStart = posStart - 12 //reached start of required div
      posEnd = posEnd - 13 //reached end of required div
      quesString[1].question = x.substring(posStart,posEnd)
      let start = quesString[1].question.substring(0,quesString[1].question.indexOf("contenteditable")-1)
      let end = quesString[1].question.substring(quesString[1].question.indexOf("tabindex")-2,)
      quesString[1].question = start + end

}

export default class AnswerExplanation extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.items = ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|','CreateLink', 'Image', 'CreateTable', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', 'SuperScript', 'SubScript', '|',
            'ClearFormat', 'Print','|', 'Undo', 'Redo'
        ];
        this.toolbarSettings = {
            items: this.items
        };
        this.quickItems = [
            'Align', 'Caption',  '-',
             'Display', 'AltText', 'Dimension'
        ];
        this.quickToolbarSettings= {
          image: this.quickItems
        };
    }
    componentDidMount() {
        if(quesString[1].question != null){
            let x = new DOMParser().parseFromString(quesString[1].question,"text/html");
            let y = x.documentElement.querySelectorAll("div")
            let total = y[0].innerHTML
            document.getElementById("answerContent").insertAdjacentHTML('beforeend', total);
        }
    }
    handleFullScreen(e) {
        let sbCntEle = document.querySelector('.sb-content.e-view');
        let sbHdrEle = document.querySelector('.sb-header.e-view');
        let leftBar;
        let transformElement;
        if (Browser.isDevice) {
            leftBar = document.querySelector('#right-sidebar');
            transformElement = document.querySelector('.sample-browser.e-view.e-content-animation');
        }
        else {
            leftBar = document.querySelector('#left-sidebar');
            transformElement = document.querySelector('#right-pane');
        }
        if (e.targetItem === 'Maximize') {
            if (Browser.isDevice && Browser.isIos) {
                addClass([sbCntEle, sbHdrEle], ['hide-header']);
            }
            addClass([leftBar], ['e-close']);
            removeClass([leftBar], ['e-open']);
            if (!Browser.isDevice) {
                transformElement.style.marginLeft = '0px';
            }
            transformElement.style.transform = 'inherit';
        }
        else if (e.targetItem === 'Minimize') {
            if (Browser.isDevice && Browser.isIos) {
                removeClass([sbCntEle, sbHdrEle], ['hide-header']);
            }
            removeClass([leftBar], ['e-close']);
            if (!Browser.isDevice) {
                addClass([leftBar], ['e-open']);
                transformElement.style.marginLeft = leftBar.offsetWidth + 'px';
            }
            transformElement.style.transform = 'translateX(0px)';
        }
    }
    actionCompleteHandler(e) {
        if (e.targetItem && (e.targetItem === 'SourceCode' || e.targetItem === 'Preview')) {
            this.rteObj.sourceCodeModule.getPanel().style.display = 'none';
            this.mirrorConversion(e);
        }
        else {
            setTimeout(() => { this.rteObj.toolbarModule.refreshToolbarOverflow(); }, 400);
        }
    }

    render() {
        return (
        <div className='control-pane' >
            <div className='control-section' >
              <div className='rte-control-section'>
                <RichTextEditorComponent ref={(richtexteditor) => { this.rteObj = richtexteditor; }} showCharCount={true} actionBegin={this.handleFullScreen.bind(this)} actionComplete={this.actionCompleteHandler.bind(this)} toolbarSettings={this.toolbarSettings} quickToolbarSettings={this.quickToolbarSettings}>
                  <div id="answerContent">
                  </div>
                  <Inject services={[Toolbar, Image, Link, HtmlEditor, Count, QuickToolbar, Table]}/>
                </RichTextEditorComponent>
              </div>
            </div>
            <FormHelperText
                id="errAns"
                style={{ color: "red", marginLeft: "13px", display: "none" }} >
                Required*
            </FormHelperText>
        </div>);
    }
}
