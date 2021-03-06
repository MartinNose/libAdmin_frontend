import React, { Component } from 'react'
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton,MessageBar, Link, MessageBarType } from 'office-ui-fabric-react';

const env = require('./.env.js')
const url = env.url;

class Book {
    constructor(str) {
        var arr = str.split(',').map(item => item.trim())
        this.bno = arr[0]
        this.category = arr[1]
        this.title = arr[2]
        this.press = arr[3]
        this.year = arr[4]
        this.author = arr[5]
        this.price = arr[6].split('.')[0]
        this.total = arr[7]
        this.stock = arr[7]
    }
}

class BookManage extends Component {
  constructor() {
    super()

    this.state = {
      book: {
        bno: "",
        category: "",
        title: "",
        press: "",
        author: "",
        year: "",
        price: "",
        press: "",
        total: "",
        stock: ""
      },
      books: [],
      message: "Paste files to import",
      newbook: {},
      Umessage:"Input bno to updates"
    }
  }
 
  onColumnClick(ev, column) {
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

  onInputChange = (event, text) => {
    let q = this.state.book
    q[event.target.labels[0].outerText] = text
    if (event.target.labels[0].outerText === 'total') {
        q['stock'] = text
    }
    console.log(this.state.book)
    this.setState({
      book: q
    })
  }

  async post() {
    const raw = await fetch(url + '/api/insertBook', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.book)
      })
      const items = await raw.json()
      if (!items.err) {
        console.log(items)
        alert("Insertion Complete")
      } else {
          alert(items.err)
      }
  }

  async onQueryClick() {
    for (let i in this.state.book) {
        if (this.state.book[i] === "") {
            alert("Attributes Can't not be empty")
            return
        }
    }
    this.post()
  }
  async onBatchChange(event, text) {
    await event;
    let books = []
    books = text.split('\n').filter(item => item.length > 0 && item.split(',').length === 8).map(item => new Book(item.trim()))
    this.setState({
        books: books
    })
  }

  async onBatchClick() {
    if (this.state.books.length === 0) {
        alert("Invalid files")
        return
    }
    const raw = await fetch(url + '/api/insertBooks', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.books)
      })
    const items = await raw.json()
    if (!items.err) {
        this.setState({
            type: "success",
            message: items.length + ' books imported. ' 
        })
    } else {
        this.setState({
            type: "error",
            message: items.err
        })
        console.log(items.err)
    }
  }

  render() {
    return (
      <div style={{display:"flex", flexDirection:"column",  alignItems:"flex-start", marginLeft: 10, marginRight: 10}}>
          <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end' }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 70}}>
              <TextField label="bno" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="category" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="title" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="author" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="year" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="price" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="press" required onChange={this.onInputChange.bind(this)}/>
              <TextField label="total" required onChange={this.onInputChange.bind(this)}/>
              <Stack.Item align="end">
                <PrimaryButton text="Insert" onClick={this.onQueryClick.bind(this)}/>
              </Stack.Item>
            </Stack>
          </div>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <Stack tokens={{ childrenGap: 10 }} style={{width: 1000}}>
                <TextField label="Batch Import" multiline rows={9} autoAdjustHeight width="800" onChange={this.onBatchChange.bind(this)}/>
            </Stack>
            <Stack tokens={{ childrenGap: 10 }} >
            <Stack.Item align="start">
                <p style={{fontSize: 30}}> </p>
                <MessageBar
                    messageBarType={MessageBarType[this.state.type]}
                    isMultiline={true}
                    dismissButtonAriaLabel="Close"
                    >
                    {this.state.message}
                    <Link href="#/search">
                    Show all the books.
                    </Link>
                </MessageBar>
            </Stack.Item>
            <Stack.Item align="start">
                    <PrimaryButton text="Insert" onClick={this.onBatchClick.bind(this)}/>
            </Stack.Item>
            </Stack>
          </Stack>
          <div style={{display:"flex", flexDirection: "column", alignItems: 'flex-stretch' }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <TextField label="bno" errorMessage={this.state.msg} onChange={this.onUpdateChange.bind(this)}/>
              <TextField label="category" onChange={this.onUpdateChange.bind(this)}/>
              <TextField label="title" onChange={this.onUpdateChange.bind(this)}/>
              <TextField label="press" onChange={this.onUpdateChange.bind(this)}/>
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <TextField label="year" onChange={this.onUpdateChange.bind(this)}/>
              <TextField label="author" onChange={this.onUpdateChange.bind(this)}/>
              <TextField label="price" onChange={this.onUpdateChange.bind(this)}/>
              <Stack.Item align="end"><PrimaryButton text="Update" onClick={this.onUpdateClick.bind(this)}/></Stack.Item>
            </Stack>
            <p style={{marginTop:10}}>
            <MessageBar
                    messageBarType={MessageBarType[this.state.Utype]}
                    isMultiline={true}
                    dismissButtonAriaLabel="Close"
                    >
                    {this.state.Umessage}
                    <Link href="#/search">
                    Show all the books.
                    </Link>
            </MessageBar>
            </p>
          </div>
      </div>
    )
  }
  async onUpdateChange(ev, tx) {
    await ev
    let nb = this.state.newbook;
    nb[ev.target.labels[0].outerText] = tx
    this.setState({
      newbook: nb
    })
    if (ev.target.labels[0].outerText === 'bno') {
      this.updateU(tx)
    }
  }

  async updateU(tx) {
    
      const raw = await fetch(url + '/api/update', {
        method: "POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({bno: tx})
      })
      const res = await raw.json()
      console.log(res)
      this.setState({
        Umessage: (!res.err)?"Valid Bno " + JSON.stringify(res):"Waiting Input",
        Utype: (!res.err)?"success":""
      })
  }
  
  async onUpdateClick() {
    this.setState({
      msg:(!this.state.newbook.bno)?"required":""
    })
    if (!this.state.newbook.bno) return;
    console.log(this.state.newbook)
    const raw = await fetch(url + '/api/update', {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(this.state.newbook)
    })
    const res = await raw.json()
    if (!res.err) {
      this.setState({
        Umessage:"Update done",
        Utype: 'success'
      })
    } else {
      alert(res.err)
    }
  } 
}

export default BookManage
