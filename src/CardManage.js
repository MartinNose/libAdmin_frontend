import React, { Component } from 'react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList'
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { TextField} from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';


const env = require('./.env.js')
const url = env.url;

class CardManage extends Component {
  constructor() {
    super()

    this.columns = [{
      key: 'cno',
      name: 'cno',
      fieldName: 'cno',
      maxWidth: 200,
    }, {
        key: 'name',
        name: 'name',
        fieldName: 'name',
        maxWidth: 200
    } ,{
      key: 'department',
      name: 'department',
      fieldName: 'department',
      maxWidth: 200,
    }, {
      key: 'type',
      name: 'type',
      fieldName: 'type',
      maxWidth: 300,
    }]

    this.state = {
      items: [],
      card: {},
      message:"",
      messageBR: ""
    }
  }
  async componentWillMount() {
    await this.componentWillReceiveProps()
  }
  async componentWillReceiveProps() {
    const raw = await fetch(url + '/api/allcard')
    const items = await raw.json()
    if (!items.err) {
      this.setState({
        items: items,
      })
    }
  }

  getSelectionDetails() {
    const selected = this.selection.getSelection().map(item => item.id)
    return selected
  }

 async fetchcards() {
    const curbk = await fetch(url + '/api/allcard')
    const items = await curbk.json()
    console.log(items)
    if (!items.err) {
      this.setState({
        items: items
      })
    }
 }

  async onInputChange(event, text) {
    await event
    let card = this.state.card
    card[event.target.labels[0].outerText] = text
    this.setState({
        card: card
    })
    console.log(this.state.card)
  }

  async onAdd() {
      console.log(this.state.card)
      const raw = await fetch(url + '/api/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.card)
      })
      const res = await raw.json()
      if (!res.err) {
          this.setState({
            type:"success",
            message:"Card added"
          })
          this.fetchcards()
      } else {
          this.setState({
            type:"error",
            message:res.err
          })
      }
  }
  async onDeleteChange(ev, text) {
    await ev;
    this.setState({
        deleteCno:text
    })
  }
  async onDelete() {
    if (!this.state.deleteCno) {
        this.setState({
            messageDL: "Empty Input"
        })
    }
    const raw = await fetch(url + '/api/cancel', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cno: this.state.deleteCno})
    })
    const res = await raw.json()
    if (!res.err) {
        this.setState({
            typeDL: "success",
            messageDL: "Delete success"
        })
        this.fetchcards()
    } else {
        this.setState({
            typeDL: "error",
            messageDL: res.err
        })
    }
  }

  render() {
    return (
      <div>
          <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end',marginLeft:10 }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <TextField label="cno" onChange={this.onInputChange.bind(this)}/>
              <TextField label="name" onChange={this.onInputChange.bind(this)}/>
              <TextField label="department" onChange={this.onInputChange.bind(this)}/>
              <TextField label="type" onChange={this.onInputChange.bind(this)}/>
              <Stack.Item align="end">
                <PrimaryButton text="Add" onClick={this.onAdd.bind(this)}/>
              </Stack.Item>
              <Stack.Item align="end">
                <MessageBar 
                    messageBarType={MessageBarType[this.state.type]}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                >{this.state.message}</MessageBar>
              </Stack.Item>
            </Stack>
          </div>
          <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end',marginLeft:10 }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <TextField label="Delete a card" onChange={this.onDeleteChange.bind(this)}/>
              <Stack.Item align="end">
                <DefaultButton text="Delete" onClick={this.onDelete.bind(this)}/>
              </Stack.Item>
              <Stack.Item align="end">
                <MessageBar 
                    messageBarType={MessageBarType[this.state.typeDL]}
                    isMultiline={true}
                    dismissButtonAriaLabel="Close"
                >{this.state.messageDL}</MessageBar>
              </Stack.Item>
            </Stack>
          </div>
        <div>
            <DetailsList
                items={this.state.items}
                columns={this.columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}        
                selectionMode={SelectionMode.none}/>
        </div>
      </div>
    )
  } 
}

export default CardManage