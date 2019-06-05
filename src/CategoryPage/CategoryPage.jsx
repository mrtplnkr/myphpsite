import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { categoryActions } from '../_actions';
import { findParent, convertCat } from './TreantParser';

import chart_config from '../../my_modules/treant/basic-example'

class CategoryPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: {
                name: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		this.handleStyleChange = this.handleStyleChange.bind(this); 
    }

    handleChange(e) {
        const { name, value } = e.target;
        const { category } = this.state;
        this.setState({
            category: {
                ...category,
                [name]: value
            }
        });
    }

    componentDidMount() {
        this.props.dispatch(categoryActions.loadCategories({
            key: 0,
            name: ""
        }));

        this.handleStyleChange({target:{value:this.props.optionState}});
    }
	
	handleStyleChange(e) { 
        const { value } = e.target; 
        if (value == 0) { 
            this.refreshTreant(this.props.categories.items, this.props.categories.parentCategory); 
        } else if (value == 1) { 
            this.refreshNetwork(this.props.categories.items, this.props.categories.parentCategory); 
        } else if (value == 2) {
            this.refreshTimeline(this.props.categories.items, this.props.categories.parentCategory);
        }
    } 

    refreshTimeline(cats, parent) {
        var container = document.getElementById('visualization');
        container.innerHTML = "";
        var data = [
            {id: 1, content: 'item 1', start: '2013-04-20'},
            {id: 2, content: 'item 2', start: '2013-04-14'},
            {id: 3, content: 'item 3', start: '2013-04-18'},
            {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
            {id: 5, content: 'item 5', start: '2013-04-25'},
            {id: 6, content: 'item 6', start: '2013-04-27'}
        ];
        var options = {};
        var timeline = new vis.Timeline(container, data, options);
    }
 
    refreshNetwork(cats, parent) { 
        // create an array with nodes
        var nodes = new vis.DataSet([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
        ]);
        // create an array with edges
        var edges = new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5},
        {from: 3, to: 3}
        ]);
        // create a network
        var container = document.getElementById('basic-example');
        var data = {
        nodes: nodes,
        edges: edges
        };
        var options = {};
        var network = new vis.Network(container, data, options);
    } 

    refreshTreant(cats, parent) {
        
        let config = {
            container: "#basic-example",
            
            connectors: {
                type: 'step'
            },
            node: {
                HTMLclass: 'nodeExample1'
            }
        };

        let objects = [];
        cats.forEach(currentCat => {
            let insideParentCats = cats.filter(p => p.parentCategory&&p.parentCategory.key == currentCat.key);
            let translatedParent = findParent(currentCat, parent);
            
            return objects.push(convertCat(translatedParent, currentCat, insideParentCats))
        });
        
        return new Treant([config, parent, 
            ...objects
        ]);
        // new Treant( chart_config )
    }

    handleSubmit(e) {
        e.preventDefault();
        
        this.setState({ submitted: true });
        const { category } = this.state;
        const { dispatch } = this.props;
        if (category.name) {
            dispatch(categoryActions.addCategory({key: this.props.categories.items.length + 1, name: category.name, parentCategory: this.props.categories.parentCategory}));
        }
    }

    handleRefresh() {
        return (e) => this.refreshTreant(this.props.categories.items, this.props.categories.parentCategory);
    }

    handleStartFresh() {
        return (e) => this.props.dispatch(categoryActions.purge());
    }

    handleDeleteCategory(id) {
        return (e) => this.props.dispatch(categoryActions.delete(id));
    }

    handleParentCat(cat) {
        return (e) => this.props.dispatch(categoryActions.loadCategories(cat));
    }

    handleEditCategory(key) {
        return (e) => this.props.dispatch(categoryActions.loadCategories(key));
    }

    render() {
		const { optionState } = 2; 
        const { submitted, category } = this.state;
        const { categories } = this.props;//.categories.filteredItems
        // const currentParent = this.props.categories.parentCategory;
        // const previousParent = this.props.categories.parentCategory.parentCategory;
        return (
            <div>
                <div className="d-flex fd-column">
                    <div>
                        <p>
                            <Link to="/">Back to Users</Link>
                            <Link to="/login" className="float-right">Logout</Link>
                        </p>
                        {   categories.loading && <em>Loading categories...</em>}
                        {   categories.error && <span className="text-danger">ERROR: {categories.error}</span>}
                    </div>
                    <div className="d-flex">
                        <div className="f-1">
                            {   
                                categories.parentCategory && categories.parentCategory.name.length > 0 &&
                                <h2>
                                    Parent cat: {categories.parentCategory.name}
                                </h2>
                            }
                            <form name="form" onSubmit={this.handleSubmit}>
                                <div className={'form-group' + (submitted && !category.name ? ' has-error' : '')}>
                                    <label htmlFor="name">Category</label>
                                    <input type="text" className="form-control" name="name" 
                                        value={category.name} onChange={this.handleChange} />
                                        {submitted && !category.name &&
                                            <div className="help-block">Category name is required</div>
                                        }
                                </div>
                                <div className="form-group">
                                    <button disabled={categories.parentCategory.parentCategory==undefined} type="button" className="btn btn-default" 
                                        onClick={this.handleParentCat(categories.parentCategory.parentCategory)}>Back</button>
                                    <button className="btn btn-primary">Add</button>
                                    <button disabled={this.props.categories.items.length==0} type="button" className="btn btn-warning" 
                                        onClick={this.handleRefresh()}>Refresh</button>
                                    <button disabled={this.props.categories.items.length==0} type="button" className="btn btn-danger" 
                                        onClick={this.handleStartFresh()}>Reset</button>
                                </div>
                            </form>
                        </div>
                        <div className="f-1 ta-center">
                            {categories.filteredItems && categories.filteredItems.length > 0 &&
                            <div>
                                <h3>Your categories:</h3>
                                <ul>
                                    {categories.filteredItems.map((cat) =>
                                        <ol key={cat.key}>
                                            <a onClick={this.handleEditCategory(cat)}>{cat.name}</a>
                                            {
                                                <span> - <a onClick={this.handleDeleteCategory(cat)}>Delete</a></span>
                                            }
                                        </ol>
                                    )}
                                </ul>
                            </div>
                            }
                        </div>
                    </div>
                    <div>
                        <select value={optionState} onChange={this.handleStyleChange}> 
                            { 
                                [{key:0,name:'Treant'}, {key:1,name:'Bubbles'}, {key:2,name:'Network'}].map(option => { 
                                    return <option key={option.key} value={option.key}>{option.name}</option> 
                                })
                            }
                        </select>
                    </div>
                </div>
                
                <div className="d-flex jc-center">
                    <div className="chart d-flex jc-center" id="basic-example"></div>
                </div>
                <div id="visualization"></div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { categories } = state;
    return {
        categories
    };
}

const connectedCategoryPage = connect(mapStateToProps)(CategoryPage);
export { connectedCategoryPage as CategoryPage };