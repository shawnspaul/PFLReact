import React, { Component } from 'react';

//import { Link } from 'react-router';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import logo from './images/pfl.png';

const styles = theme => ({
    flex: {
        flex: 1,
        textAlign: 'left'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }
});

class Header extends Component {
    displayName = Layout.name

    constructor(props) {
        super();
        this.state = {
            title: ""
        }
    };


    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    render() {
        return (
            <div className="App">
                <AppBar position="static">
                    <Toolbar style={{ backgroundColor: 'white', color: '#00aeef' }}>
                        <Link to="/">
                            <img style={{ height: '25px' }} src={logo} alt="PFL Logo" />
                        </Link>
                        <div style={{ width:"20px" }}></div>
                        <Link to="/products">
                            <Button color="inherit" style={{ fontSize:"20px" }}>Products</Button>
                        </Link>
                    </Toolbar>
                </AppBar>
                <div className="container-fluid">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const Layout = withStyles(styles)(Header);
export { Layout };