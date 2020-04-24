import React, { Component } from 'react'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList'
const env = require('./.env.js')
const url = env.url;

class Search extends Component {
  constructor() {
    super()

    this.columns = [{
      key: 'bno',
      name: 'bno',
      fieldName: 'bno',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'category',
      name: 'category',
      fieldName: 'category',
      onColumnClick: this.onColumnClick.bind(this),
    } ,{
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'author',
      name: 'Author',
      fieldName: 'author',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'year',
      name: 'year',
      fieldName: 'year',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'price',
      name: 'Price',
      fieldName: 'price',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'total',
      name: 'Total',
      fieldName: 'total',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'stock',
      name: 'Stock',
      fieldName: 'stock',
      onColumnClick: this.onColumnClick.bind(this),
    }, {
      key: 'press',
        name: 'Press',
        fieldName: 'press',
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
    //   selected: this.getSelectionDetails(),
    }
  }
  async componentWillMount() {
    await this.componentWillReceiveProps()
  }
  async componentWillReceiveProps() {
    const raw = await fetch(url + '/api/search', {
      method: "POST",
      query: this.props.query
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
  render() {
    return (
      <div>
        {/* <SearchBox
          label="Search:"
          onChanged={
            text => this.setState({
              items: text ? Filter(text) : this.state.rawItems,
            })
          }
        /> */}
        <div>
            <DetailsList
              items={this.state.items}
              columns={this.columns}
              setKey="set"
            //   layoutMode={DetailsListLayoutMode.justified = 1}
              selectionMode={SelectionMode.none}
            />
        </div>
        
      </div>
    )
  }
}

export default Search
