import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Get } from 'react-axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

class ProductList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            products: [],
        }
    };

    componentWillMount() {

    }
    componentDidMount() {
        this.fetchProducts();
    }

    async fetchProducts() {
    }

    render() {
        return (
            <div>
                <div>
                    <br />
                    <Get url="/api/Data/ProductList">
                        {(error, response, isLoading, onReload) => {
                            if (error) {
                                return (<div>Something bad happened: {error.message} <button onClick={() => onReload({ params: { reload: true } })}>Retry</button></div>)
                            }
                            else if (isLoading) {
                                return (<div><LinearProgress color="secondary" /></div>)
                            }
                            else if (response !== null) {
                                return (
                                    <Paper>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><b style={{ fontSize:"20px" }}>Image</b></TableCell>
                                                    <TableCell><b style={{ fontSize: "20px" }}>Name</b></TableCell>
                                                    <TableCell><b style={{ fontSize: "20px" }}>Description</b></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {response.data.map(row => {
                                                    let link = "/product/" + row.productID;
                                                    return (
                                                        <TableRow key={row.productID}>
                                                            <TableCell component="th" scope="row">
                                                                <img style={{ maxHeight:"100px" }} src={row.imageURL} />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row"><b style={{ fontSize: "16px" }}>{row.name}</b></TableCell>
                                                            <TableCell style={{ fontSize: "16px" }}>{row.description}</TableCell>
                                                            <TableCell><Link to={link}><Button color="inherit" style={{ fontSize:"16px" }}>View</Button></Link></TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Paper>
                                )
                            }
                            return (<div><LinearProgress color="secondary" /></div>)
                        }}
                    </Get>
                </div>
            </div>
        );
    }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Products = withStyles(styles)(ProductList);

export { Products };