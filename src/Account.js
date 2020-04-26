import React, { Component } from 'react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList'
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';


const env = require('./.env.js')
const url = env.url;

class Account extends Component {
  constructor() {
    super()

    this.columns = [{
      key: 'bno',
      name: 'bno',
      fieldName: 'bno',
      isResizable: true,
      maxWidth: 200,
      onColumnClick: this.onColumnClick.bind(this),
    } ,{
      key: 'cno',
      name: 'cno',
      fieldName: 'cno',
      minWidth: 100,
      maxWidth:300,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'borrow_date',
      name: 'borrow_date',
      fieldName: 'borrow_date',
      maxWidth: 200,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'return_date',
      name: 'return_date',
      fieldName: 'return_date',
      maxWidth: 300,
      onColumnClick: this.onColumnClick.bind(this),
    }]

    this.state = {
      items: [],
      card: {},
      cno: "",
      message:"Please input your card number",
      messageBR: ""
    }
  }
  async componentWillMount() {
    // await this.componentWillReceiveProps()
  }
  async componentWillReceiveProps() {
    const raw = await fetch(url + '/api/curBk', {
        method: "POST",
        body: JSON.stringify({cno: this.state.cno})
    })
    const items = await raw.json()
    if (!items.err) {
      this.setState({
        items: items,
      })
    }
  }
  onColumnClick(ev, column) {
    console.log(ev)
    console.log(column)
    const items = this.state.items
    let newItems = []
    for (let i = 0; i < items.length; i += 1) {
      newItems[i] = { ...items[i] }
    }
    const field = column.fieldName
    newItems = newItems.sort((a, b) => a[field] - b[field])
    this.setState({
      items: newItems,
    })
  }
  getSelectionDetails() {
    const selected = this.selection.getSelection().map(item => item.id)
    return selected
  }

 async fetchcurbk() {
    const curbk = await fetch(url + '/api/curBk', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cno: this.state.cno})
    })
    const items = await curbk.json()
    console.log(items)
    if (!items.err) {
      this.setState({
        items: items
      })
    }
 }
 async onLogin() {
    console.log(this.state.cno)
    const raw = await fetch(url + '/api/cardin', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cno: this.state.cno})
    })
    if (raw.status === 200) {
        let card = await raw.json()
        this.setState({
            type: "success",
            card: card,
            message: "Current cno:" + card.cno
        })
        console.log(this.state)
    } else {
        this.setState({
            type: "error",
            message: "Invalid Card Number"
        })
    }
    this.fetchcurbk()
  }

  async onInputChange(event, text) {
    await event;
    this.setState({
        cno: text
    })
    console.log(this.state)
  }

  onBnoChange(ev, text) {
      this.setState({
          bno: text
      })
  }

  render() {
    return (
      <div>
          <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end' }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <span> </span>
              <TextField label="cno" onChange={this.onInputChange.bind(this)}/>
              <Stack.Item align="end">
                <PrimaryButton text="Login" onClick={this.onLogin.bind(this)}/>
              </Stack.Item>
              <Stack.Item align="end">
                <MessageBar 
                    messageBarType={MessageBarType[this.state.type]}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                >{this.state.message}</MessageBar>
              </Stack.Item>
              <Stack.Item align="end">
                {(this.state.type === "success") && <p style={{margin:0, paddingBottom:10}}>
                    {(this.state.card.type === 'S')
                        ?<span style={{color: "blue"}}>Student</span>
                        :<span style={{color: "purple"}}>Teacher</span>
                    }&nbsp;
                    <strong>Name</strong>: {this.state.card.name}, 
                    <strong>Department</strong>: {this.state.card.department}
                </p>}
              </Stack.Item>
            </Stack>
        </div>
        <div>
            {this.state.type === "success"  && this.state.items.length !== 0 &&
            <DetailsList
                items={this.state.items}
                columns={this.columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}        
                selectionMode={SelectionMode.none}/>}
        </div>
        <div>
            { this.state.type === "success" && this.state.items.length === 0 && 
            <p>&nbsp;No records yet</p>}
        </div>
        <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end', marginLeft:10}}>
            {this.state.type === "success" && 
                <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
                <TextField label="wantedBno" onChange={this.onBnoChange.bind(this)}/>
                <Stack.Item align="end">
                    <PrimaryButton text="Borrow" onClick={this.onBorrow.bind(this)}/>
                </Stack.Item>
                <Stack.Item align="end">
                    <PrimaryButton text="Return" onClick={this.onReturn.bind(this)}/>
                </Stack.Item>
                <Stack.Item align="end">
                    <MessageBar
                        messageBarType={MessageBarType[this.state.typeBR]}
                        isMultiline={false}
                        dismissButtonAriaLabel="Close"
                    >{this.state.messageBR}</MessageBar>
                </Stack.Item>
                </Stack>
            }
        </div>
        
      </div>
    )
  } 

  async onBorrow() {
      const raw = await fetch(url + '/api/borrow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({cno: this.state.cno, bno: this.state.bno})
      })
      const msg = await raw.json()
      console.log(msg)
      if (!msg.err) {
        this.setState({
            messageBR: "Borrow succeeded",
            typeBR: "success"
        })
      } else {
        this.setState({
            messageBR: msg.err,
            typeBR: "error"
        })
      }
      this.fetchcurbk()
  }

  async onReturn() {
    const raw = await fetch(url + '/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({cno: this.state.cno, bno: this.state.bno})
    })
    const msg = await raw.json()
    console.log(msg)
    if (!msg.err) {
      this.setState({
          messageBR: "return succeeded",
          typeBR: "success"
      })
    } else {
      this.setState({
          messageBR: msg.err,
          typeBR: "error"
      })
    }
    this.fetchcurbk()
  }
}

export default Account
