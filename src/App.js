import React, { Component } from 'react'
import { Nav } from 'office-ui-fabric-react/lib/Nav'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { Fabric } from 'office-ui-fabric-react/lib/Fabric'
import 'office-ui-fabric-react/dist/css/fabric.min.css'
import injectSheet from 'react-jss'
import {  
  HashRouter as Router,
  Route,
} from 'react-router-dom'
// import './main.css'


import Home from './Home'
import Search from '.Search'
import Account from './Account'
import BookManage from './BookManage'
import CardManage from './CardManage'

const styles = {
  App: {
    display: 'flex',
    flexDirection: 'column',
  },
  Header: {
    backgroundColor: '#000',
    color: '#FFF',
    display: 'flex',
    fontSize: 20,
    padding: 5,
  },
  Icon: {
    color: '#FFF',
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
  },
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      showPanel: false,
    }

    this.menu = [{
      links: [
        {
          name: 'Home',
          url: '#/',
        },
        {
          name: '查询',
          url: '#/search',
        },
        {
          name: '图书借还',
          url: '#/account',
        },
        {
          name: '图书入库',
          url: '#/bookmanage',
        },
        {
          name: '证件管理',
          url: '#/cardmanage',
        },
      ],
    }]
  }

  showPanel() {
    this.setState({
      showPanel: true,
    })
  }
  render() {
    return (
      <Router>
        <Fabric>
          <div className={this.props.classes.App}>
            <header className={this.props.classes.Header}>
              <i className={`${this.props.classes.Icon} ms-Icon ms-Icon--CollapseMenu`} onClick={this.showPanel.bind(this)} aria-hidden="true" />
              Lib Admin
            </header>
            <Panel
              isOpen={this.state.showPanel}
              type={PanelType.smallFixedNear}
              headerText="Menu"
              closeButtonAriaLabel="Close"
              isLightDismiss
              onDismiss={() => this.setState({ showPanel: false })}
              onRenderFooterContent={() => (
                <div className={this.props.classes.Side}>
                  <Nav groups={this.menu} expandedStateText={'expanded'} collapsedStateText={'collapsed'} />
                </div>
              )}
            />
            <div className={this.props.classes.Content}>
              <Route exact path="/" component={Home} />
              <Route path="/search" component={Search} />
              <Route path="/account" component={Account} />
              <Route path="/bookmanage" component={BookManage} />
              <Route path="/cardmanage" component={CardManage} />
            </div>
          </div>
        </Fabric>
      </Router>
    )
  }
}

export default injectSheet(styles)(App)
