import React from 'react';
import {withRouter} from 'react-router-dom'

import {Mutation} from 'react-apollo';
import {ADD_RECIPE, GET_ALL_RECIPES} from '../../queries';

import Error from '../Error'

const initialState = {
    name: '',
    instructions:'',
    category:'Breakfast',
    description:'',
    username:''

};


class AddRecipe extends React.Component{



    state = {...initialState};

    clearState = ()=> {
    this.setState({ ...initialState })
    }

    componentDidMount(){
        this.setState({
            username: this.props.session.getCurrentUser.username
        })
    }

    handleChange = event => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    handleSubmit = (event, addRecipe) =>{
        event.preventDefault();
        addRecipe().then(({data}) => {
            console.log(data);
            this.clearState();
            this.props.history.push('/');
        })

}
    validateForm = ()=>{
        const { name, category, description, instructions} = this.state;
        const isInvalid = !name || !description || !category || !instructions;

        return isInvalid
    }
    updateCache = (cache, {data : {addRecipe}})=>{
    const {getAllRecipes} = cache.readQuery({query: GET_ALL_RECIPES})
    console.log('read :', getAllRecipes)

    cache.writeQuery({
        query: GET_ALL_RECIPES,
        data:{
            getAllRecipes : getAllRecipes.concat([addRecipe])
        }
    })
    };

    render(){
        const { name, category, description, instructions, username } = this.state;
    return(   
    <Mutation 
        mutation={ADD_RECIPE} 
        variables={{name, category, description, instructions, username}} 
        update={this.udateCache}
    >
    {(addRecipe,{ data, loading, error })=>{

    return (
        <div className="App">
            <h2 className="App">Add recipe</h2>
            <form className="form" onSubmit={event=> this.handleSubmit(event, addRecipe)}>
            <input type="text" name="name" placeholder="Recipe Name" onChange={this.handleChange} value={name}/>
            <select name="category" onChange={this.handleChange} value={category}>
                <option value="Breackfast">Breackfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snac">Snac</option>
            </select>
            <input type="text" name="description" placeholder="Add description" onChange={this.handleChange} value={description}/>
            <textarea name="instructions" placeholder="Add instructions" onChange={this.handleChange} value={instructions}></textarea>
            <button disabled={loading || this.validateForm()} type="submit" className="button-primary"> Submit</button>
            {error && <Error error={error}/>}
            </form>
        </div>
    )
        }}  
   </Mutation>)
    }
}

export default withRouter(AddRecipe);