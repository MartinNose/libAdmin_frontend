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
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      minWidth: 100,
      maxWidth:300,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'category',
      name: 'category',
      fieldName: 'category',
      maxWidth: 200,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'author',
      name: 'Author',
      fieldName: 'author',
      maxWidth: 300,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'year',
      name: 'year',
      fieldName: 'year',
      maxWidth: 200,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'price',
      name: 'Price',
      fieldName: 'price',
      maxWidth: 20,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'total',
      name: 'Total',
      fieldName: 'total',
      maxWidth: 20,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'stock',
      name: 'Stock',
      fieldName: 'stock',
      maxWidth: 20,
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'press',
        name: 'Press',
        fieldName: 'press',
        minWidth: 200,
        maxWidth: 300,
        onColumnClick: this.onColumnClick.bind(this),
    }]

    this.state = {
      items: [{
          bno:"123345",
          category:"cs",
          title:"DB",
          press:"ZJU",
          year:"2019-10-02",
          author:"Zhang San",
          price:null,
          total:10,
          stock:10}],
      card: {},
      cno: "",
      message:"Please input your card number"
    }
  }
  async componentWillMount() {
    await this.componentWillReceiveProps()
  }
  async componentWillReceiveProps() {
    const raw = await fetch(url + '/api/search', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: this.props.query
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

 async onLogin() {
    console.log(this.state.cno)
    console.log(url)
    const raw = await fetch(url + '/api/cardin', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
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
            {this.state.type === "success" && 
                <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
                &nbsp;
                <TextField label="bno" onChange={this.onBnoChange.bind(this)}/>
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
                </Stack>
            }
        </div>
        
      </div>
    )
  } 
}

export default Account
