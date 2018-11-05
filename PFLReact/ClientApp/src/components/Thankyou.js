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


class Thanks extends React.Component {
    state = {
        spacing: '16',
        orderNumber: null
    };

    handleChange = key => (event, value) => {
        this.setState({
            [key]: value,
        });
    };

    componentWillMount() {
        this.setState({ orderNumber: this.props.match.params.orderid });
    }
    render() {
        const { classes } = this.props;
        //const { spacing } = this.state;
        return (
            <Grid container className={classes.root} justify="center">
                <Paper className={classes.paper}>
                    <h1>Thank you for your order!</h1>
                    <div justify="left">
                        <p>
                            You're confirmation number is below. Please keep this for your reference.
						</p>
                        <p>
                            Confirmation Number: <b>{this.state.orderNumber}</b>
						</p>
                    </div>
                </Paper>
            </Grid>
        );
    }
}

Thanks.propTypes = {
    classes: PropTypes.object.isRequired,
}

const Thankyou = withStyles(styles)(Thanks);
export { Thankyou };