import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 5,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    paper: {
        ...theme.mixins.gutters(),
        maxWidth: 1500,
        margin: theme.spacing.unit * 1,
        backgroundColor: '',
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    card: {
        margin: 5,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#11214f',
        color: 'rgb(230, 218, 146)',
        maxWidth: 345
    },
});


class HomePage extends React.Component {
    state = {
        spacing: '16',
    };

    handleChange = key => (event, value) => {
        this.setState({
            [key]: value,
        });
    };
    render() {
        const { classes } = this.props;
        //const { spacing } = this.state;
        return (
            <Grid container className={classes.root} justify="center">
                <Paper className={classes.paper}>
                    <h1>Hello, Potential Customer!</h1>
                    <div justify="left">
                        <p>
                            We're implementing our Tactile Marketing Automation campaign and you are here to test it! It'll be fun, we promise!
						</p>
                        <p>
                            Buying products from us is simple. You should see a navigation menu on the left; if you click on the "Products" link.
						    You will be taken to our products page and will be able to see a great list of very cool products!
						</p>
                        <p>
                            If for some reason you don't think our products are cool, that's okay. We won't be mad.
						</p>
                        <p>
                            <strong>HAPPY BROWSING!!!</strong>
                        </p>
                    </div>
                </Paper>
            </Grid>
        );
    }
}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
}

const Home = withStyles(styles)(HomePage);
export {Home};