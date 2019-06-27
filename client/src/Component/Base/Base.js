import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { connect } from 'react-redux'
import { loginAuth, windowWidthChange } from '../../Actions/Status'

import Login from './Login/Login'
import Reg from './Reg/Reg'
import EmailValidation from './EmailValidation/EmailValidation'

import Header from './Component/Header/Header'

import Loading from '../Loading/Loading'

import './Base.css'

function mapStateToProps(state) {
  return {
    login: state.status.login,
    loading: state.status.loading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loginAuth () {
      dispatch(loginAuth())
    },
    windowWidthChange () {
      dispatch(windowWidthChange())
    }
  }
}

class Base extends Component {
  componentWillMount () {
    this.props.loginAuth()
  }

  componentDidMount () {
    this.props.windowWidthChange()
    window.addEventListener('resize', () => {
      this.props.windowWidthChange()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', () => {})
  }

  render () {
    const { login, loading } = this.props
    // if (login) return <Redirect to='/' />
    if (loading) return <Loading />
    return (
      <div className='base'>
        <Header />
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/reg' component={Reg} />
          <Route path='/valid/:key' component={EmailValidation} />
        </Switch>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Base)
