import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Get } from 'react-axios';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router-dom';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
    },
    root: {
        width: '100%',
        margin: '0 auto',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        maxWidth: 1500,
    },
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        fontSize: 20
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        flexBasis: 200,
    },
    button: {
        fontSize: 18,
        margin: theme.spacing.unit,
        float:'right'
    }
});

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%^&'*+/=^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class ProductView extends React.Component {
    constructor(props) {
        super();
        this.state = {
            product: {},
            productID: null,
            productURL: "",
            payload: {},
            firstName: null,
            lastName: null,
            companyName: null,
            address1: null,
            address2: null,
            city: null,
            state: null,
            postalCode: null,
            countryCode: null,
            email: null,
            phone: null,
            quantity: null,
            templateData: [],
            shippingMethod: null,
            formErrors: {
                firstName: '',
                lastName: '',
                companyName: '',
                address1: '',
                city: '',
                state: '',
                postalCode: '',
                countryCode: '',
                email: '',
                phone: '',
                quantity: '',
                shippingMethod: ''
            },
            open: false,
            orderDetail: {},
            purchaseDetail: {},
        }
        
    };

    componentWillMount() {
        this.setState({ productURL: "/api/Data/Product/" + this.props.match.params.id });
        this.setState({ productID: this.props.match.params.id });
    }

    componentDidMount() {
        axios.get(this.state.productURL)
            .then(response => this.setState({ product: response.data }));
        //this.setState({ product: response.data });
    }

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        

        switch (name) {
            case 'firstName':
                formErrors.firstName = value.length < 2 ? 'First Name is required' : '';
                break;
            case 'lastName':
                formErrors.lastName = value.length < 2 ? 'Last Name is required' : '';
                break;
            case 'address1':
                formErrors.address1 = value.length < 4 ? 'Address is required' : '';
                break;
            case 'city':
                formErrors.city = value.length < 2 ? 'City is required' : '';
                break;
            case 'state':
                formErrors.state = value.length < 2 ? 'State is required' : '';
                break;
            case 'postalCode':
                formErrors.postalCode = value.length < 4 ? 'Postal Code is required' : '';
                break;
            case 'countryCode':
                formErrors.countryCode = value.length < 1 ? 'Country is required' : '';
                break;
            case 'email':
                formErrors.email = emailRegex.test(value) && value.length < 5 ? 'Invalid Email' : '';
                break;
            case 'phone':
                formErrors.phone = value.length < 9 ? 'Phone is required' : '';
                break;
            case 'shippingMethod':
                formErrors.shippingMethod = value.length < 0 ? 'Shipping Method is required' : '';
                break;
            case 'quantity':
                formErrors.quantity = value < 1 ? 'Quantity must be greater than 0' : '';
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: value });
        this.setState({ [name]: value });
    }

    // gets called when purchase form is submitted
    handleSubmit = e => {
        // creates the payload from the form and product details sent back from the api
        e.preventDefault();

        let valid = true;

        Object.values(this.state.formErrors).map(val => {
            val > 0 && (valid = false)
        });

        Object.values(this.state.formErrors).map(val => {
            val === null && (valid = false)
        });

        if (!valid) {
            console.error("INVALID");
            return;
        }

        let payload = {
            partnerOrderReference: this.makeid(),
            orderCustomer: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                companyName: this.state.companyName,
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.city,
                state: this.state.state,
                postalCode: this.state.postalCode,
                countryCode: this.state.countryCode,
                email: this.state.email,
                phone: this.state.phone
            },
            items: [
                {
                    itemSequenceNumber: 1,
                    productID: this.state.productID,
                    quantity: this.state.quantity,
                    templateData: []
                }
            ],
            shipments: [
                {
                    shipmentSequenceNumber: 1,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    companyName: this.state.companyName,
                    address1: this.state.address1,
                    address2: this.state.address2,
                    city: this.state.city,
                    state: this.state.state,
                    postalCode: this.state.postalCode,
                    countryCode: this.state.countryCode,
                    email: this.state.email,
                    phone: this.state.phone,
                    shippingMethod: this.state.shippingMethod
                }
            ]
        };

        //loops through all custom template fields and adds them to the templateData array in the payload
        //console.log(this.state.product);
        if (this.state.product.hasTemplate) {
            for (let f of this.state.product.templateFields.fieldlist.field) {
                if (f.visible === 'Y') {
                    payload.items[0].templateData.push(
                        {
                            templateDataName: f.fieldname,
                            templateDataValue: this.state[f.fieldname] || ''
                        }
                    );
                }
            }
        }

        const postPayload = JSON.stringify(payload);
        console.log(postPayload);
        axios.post('/api/Data/Price', postPayload)
            .then(response => this.confirmOrder(response));
    }

    confirmOrder(response) {
        console.log(response.data);
        //this.props.history.push('/thankyou');
        
        this.setState({ orderDetail: response.data.orderPrices });
        this.setState({ purchaseDetail: response.data });
        this.setState({ open: true });
    }

    confirmPurchase(order) {
        const postPayLoad = JSON.stringify(order);
        axios.post('/api/Data/Purchase', postPayLoad)
            //.then(response => console.log(response.data.orderNumber))
            .then(response => this.props.history.push('/thankyou/' + response.data.orderNumber));
    }

    // makes the partnerOrderReference
    makeid() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
        }

    getField(input) {
        let required = false;
        if (input.required === "Y") {
            let required = true;
        }
        switch (input.type) {
            case 'SINGLELINE':
                return (
                    <div>
                        <input
                            type="text"
                            className="form-control"
                            name={input.htmlfieldname}
                            placeholder={input.orgvalue}
                            required={required}
                            onChange={this.handleChange}
                            value={this.state[input.htmlfieldname]} 
                        />
                    </div>
                )
                break;
            case 'MULTILINE':
                return (
                    <div>
                        <textarea
                            className="form-control"
                            name={input.htmlfieldname}
                            placeholder={input.orgvalue}
                            required={required}
                            onChange={this.handleChange}
                        >{this.state[input.htmlfieldname]} </textarea>
                    </div>
                )
                break;
            case 'GRAPHICPICKLIST':
                if (Array.isArray(input.picklist.item)) {
                    return input.picklist.item.map(option => {
                        return (
                            <div>
                                <input
                                    type="radio"
                                    name={input.htmlfieldname}
                                    value={option.value}
                                    required={required}
                                    onChange={this.handleChange}
                                />
                                <img src={option.prompt.text} alt="Photo Option" height="50px"/>
                            </div>
                        )
                    })
                } else {
                    return (
                        <div>
                            <input
                                type="radio"
                                name={input.htmlfieldname}
                                value={input.picklist.item.value}
                                required={required} 
                            />
                            <img src={input.picklist.item.prompt.text} alt="Photo Option" height="50px"/>
                        </div>
                    )
                }
                break;
            default:
                return '';
                break;
        }
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {

        const { classes } = this.props;
        const { formErrors } = this.state;

        if (this.state.open === true) {
                return (<Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    scroll={this.state.scroll}
                    aria-labelledby="scroll-dialog-title"
                >
                    <DialogTitle id="scroll-dialog-title" style={{ fontSize: 20 }}>Order Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <table className="table table-striped table-hover" style={{ fontSize: "16px" }}>
                                    <tr><td>Bundle Coupon Amount</td><td>${this.state.orderDetail.bundleCouponAmount.toFixed(2)}</td></tr>
                                    <tr><td>Envelope Price</td><td>${this.state.orderDetail.envelopeTotalPrice.toFixed(2)}</td></tr>
                                    <tr><td>Mailing Price</td><td>${this.state.orderDetail.mailingPriceTotal.toFixed(2)}</td></tr>
                                    <tr><td>Print Price</td><td>${this.state.orderDetail.printPriceTotal.toFixed(2)}</td></tr>
                                    <tr><td>Rush Price</td><td>${this.state.orderDetail.rushTotalPrice.toFixed(2)}</td></tr>
                                    <tr><td>Second Sheet</td><td>${this.state.orderDetail.secondSheetTotal.toFixed(2)}</td></tr>
                                    <tr><td></td><td></td></tr>
                                    <tr><td>Ship Price</td><td>${this.state.orderDetail.shipPriceTotal.toFixed(2)}</td></tr>
                                <tr><th>Order Total Price</th><th>${this.state.orderDetail.orderTotalPrice.toFixed(2)}</th></tr>
                            </table>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="secondary" style={{ fontSize: 18 }}>
                            Go Back
                        </Button>
                        <Button onClick={() => this.confirmPurchase(this.state.purchaseDetail)} color="primary" style={{ fontSize: 18 }}>
                            Confirm Purchase
                        </Button>
                    </DialogActions>
                </Dialog>)   
        }

        return (
            <div>
                <div>
                    <br />
                    <Get url={this.state.productURL}>
                        {(error, response, isLoading, onReload) => {
                            if (error) {
                                return (<div>Something bad happened: {error.message} <button onClick={() => onReload({ params: { reload: true } })}>Retry</button></div>)
                            }
                            else if (isLoading) {
                                return (<div><LinearProgress color="secondary" /></div>)
                            }
                            else if (response !== null) {
                                let images = response.data.images.map(img => {
                                    return img.url;
                                });
                                images.push(response.data.imageURL);
                                const slides = images.map(img => {
                                    return { original: img, thumbnail: img };
                                })
                                let template = '';
                                if (response.data.hasTemplate) {
                                    template = response.data.templateFields.fieldlist.field.map(input => {
                                        if (input.visible === 'Y') {
                                            return (<div>
                                                <label>{input.prompt[0].text.replace(/_/g, ' ')}</label>
                                                {this.getField(input)}
                                            </div>)
                                        }
                                    })
                                }
                                return (
                                    <Grid container spacing={16} className={classes.root}>
                                        <Grid item md={6} xs={12}>
                                            <ImageGallery items={slides} />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Card className={classes.card}>
                                                <CardContent>
                                                    <form id="purchaseForm" onSubmit={this.handleSubmit}>
                                                        <Typography variant="h5" component="h2">
                                                            {response.data.name}
                                                        </Typography>
                                                        <Typography className={classes.pos} color="textSecondary">
                                                            {response.data.description}
                                                        </Typography>
                                                        <div className="form-group">
                                                            <label>Quantity</label>
                                                            <input type="number" name="quantity" className="form-control" required onChange={this.handleChange} value={this.state.quantity} step={response.data.quantityIncrement} min={response.data.quantityMinimum} max={response.data.quantityMaximum} />
                                                            {formErrors.quantity.length > 0 && (<span className="errorMessage">{formErrors.quantity}</span>)}
                                                        </div>
                                                        {template}
                                                        <hr />
                                                        <h3>Personal & Shipping Information</h3>
                                                        <div className="form-group">
                                                            <label>First Name</label>
                                                            <input type="text" className="form-control" name="firstName" value={this.state.firstName} onChange={this.handleChange} required />
                                                            {formErrors.firstName.length > 0 && (<span className="errorMessage">{formErrors.firstName}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Last Name</label>
                                                            <input type="text" className="form-control" name="lastName" value={this.state.lastName} onChange={this.handleChange} required />
                                                            {formErrors.lastName.length > 0 && (<span className="errorMessage">{formErrors.lastName}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Company Name</label>
                                                            <input type="text" className="form-control" name="companyName" value={this.state.companyName} onChange={this.handleChange} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Address 1</label>
                                                            <input type="text" className="form-control" name="address1" value={this.state.address1} onChange={this.handleChange} required />
                                                            {formErrors.address1.length > 0 && (<span className="errorMessage">{formErrors.address1}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Address 2</label>
                                                            <input type="text" className="form-control" name="address2" value={this.state.address2} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>City</label>
                                                            <input type="text" className="form-control" name="city" value={this.state.city} onChange={this.handleChange} required />
                                                            {formErrors.city.length > 0 && (<span className="errorMessage">{formErrors.city}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>State</label>
                                                            <input type="text" className="form-control" name="state" value={this.state.state} onChange={this.handleChange} required />
                                                            {formErrors.state.length > 0 && (<span className="errorMessage">{formErrors.state}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Postal Code</label>
                                                            <input type="number" className="form-control" name="postalCode" value={this.state.postalCode} onChange={this.handleChange} required />
                                                            {formErrors.postalCode.length > 0 && (<span className="errorMessage">{formErrors.postalCode}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Country Code</label>
                                                            <input type="text" className="form-control" name="countryCode" value={this.state.countryCode} onChange={this.handleChange} required />
                                                            {formErrors.countryCode.length > 0 && (<span className="errorMessage">{formErrors.countryCode}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Email</label>
                                                            <input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} required />
                                                            {formErrors.email.length > 0 && (<span className="errorMessage">{formErrors.email}</span>)}
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Shipping Method</label>
                                                            <select type="text" className="form-control" name="shippingMethod" onChange={this.handleChange} required value={this.state.shippingMethod} >
                                                                <option selected disabled style={{ display: "none" }} value="">- Select -</option>
                                                                {response.data.deliveredPrices.map(delivery => {
                                                                    return (
                                                                        <option key={delivery.deliveryMethodCode} value={delivery.deliveryMethodCode}>{delivery.description} | ${delivery.price.toFixed(2)}</option>    
                                                                    )
                                                                })}
                                                            </select>
                                                            {formErrors.email.length > 0 && (<span className="errorMessage">{formErrors.email}</span>)}
                                                        </div>
                                                        <br />
                                                        <button className="btn btn-primary">
                                                            Price It!
                                                        </button>
                                                    </form>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
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

ProductView.propTypes = {
    classes: PropTypes.object.isRequired,
};

const Product = withStyles(styles)(ProductView);

export { Product };