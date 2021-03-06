import React from 'react';
import { products } from './productData';
import Logo from './logo.png';
import ProductContainer from './components/ProductContainer';
import Orders from './components/Orders';
import NavBar from './components/NavBar';
import axios from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentScreen: 'Menu',
			currentOrderID: '',
			products: products,
			orders: []
		};
	}

	addProductToOrder = async product => {
		// need to check if current id is empty
		const currentOrder = this.state.orders.filter(
			order => order.id === this.state.currentOrderID
		)[0];

		const newCurrentOrder = {
			...currentOrder,
			cart: [...currentOrder.cart, product]
		};

		const response = await axios.put(
			`/orders/${this.state.currentOrderID}`,
			newCurrentOrder
		);

		this.setState({
			orders: response.data
		});
	};

	returnCurrentScreen = () => {
		switch (this.state.currentScreen) {
			case 'Menu':
				return (
					<ProductContainer
						products={this.state.products}
						addProductToOrder={this.addProductToOrder}
					/>
				);

			case 'Orders':
				return (
					<Orders
						orders={this.state.orders}
						createNewOrder={this.createNewOrder}
						setCurrentOrder={this.setCurrentOrder}
						currentOrderID={this.state.currentOrderID}
						deleteOrder={this.deleteOrder}
					/>
				);
		}
	};

	updateCurrentScreen = newScreen => {
		this.setState({ currentScreen: newScreen });
	};

	createNewOrder = async () => {
		const response = await axios.post('/orders');

		this.setState({ orders: response.data });
	};

	setCurrentOrder = orderID => {
		this.setState({ currentOrderID: orderID });
	};

	deleteOrder = async orderID => {
		const response = await axios.delete(`/orders/${orderID}`);

		this.setState({
			orders: response.data,
			currentOrderID:
				this.state.currentOrderID === orderID
					? ''
					: this.state.currentOrderID
		});
	};

	componentWillMount = async () => {
		const response = await axios.get('/orders');
		this.setState({ orders: response.data });
	};

	render() {
		return (
			<div className="App">
				<div className="NavSpan">
					<img src={Logo} />

					<NavBar
						updateCurrentScreen={this.updateCurrentScreen}
						currentOrderID={this.state.currentOrderID}
					/>
				</div>

				{this.returnCurrentScreen()}
			</div>
		);
	}
}

export default App;
