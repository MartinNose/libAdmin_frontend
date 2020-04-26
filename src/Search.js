import React, { Component } from 'react'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList'
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react';

const env = require('./.env.js')
const url = env.url;
const stackStyles = { root: { width: 650 } };

class Search extends Component {
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
      query: {}
    }
  }
  async componentWillMount() {
    await this.componentWillReceiveProps()
  }
  async componentWillReceiveProps() {
    const raw = await fetch(url + '/api/search', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
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
    let q = this.state.query
    q[event.target.labels[0].outerText] = text
    this.setState({
      query: q
    })
  }

  async onQueryClick() {
    console.log(this.state.query)
    const raw = await fetch(url + '/api/search', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.query)
    })
    const items = await raw.json()
    console.log(items)
    if (!items.err) {
      this.setState({
        items: items,
      })
    } else {
      alert(items.err)
    }
  }

  render() {
    return (
      <div>
          <div style={{display:"flex", flexDirection: "row", alignItems: 'flex-end' }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}  styles={{width: 100}}>
              <span> </span>
              <TextField label="category" onChange={this.onInputChange.bind(this)}/>
              <TextField label="title" onChange={this.onInputChange.bind(this)}/>
              <TextField label="press" onChange={this.onInputChange.bind(this)}/>
              <TextField label="start" onChange={this.onInputChange.bind(this)}/>
              <TextField label="end" onChange={this.onInputChange.bind(this)}/>
              <TextField label="low" onChange={this.onInputChange.bind(this)}/>
              <TextField label="high" onChange={this.onInputChange.bind(this)}/>
              <Stack.Item align="end"><PrimaryButton text="Query" onClick={this.onQueryClick.bind(this)}/></Stack.Item>
            </Stack>
          </div>
        <div>
            <DetailsList
              items={this.state.items}
              columns={this.columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
        </div>
        
      </div>
    )
  } 
}

export default Search
