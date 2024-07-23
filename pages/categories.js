import Layout from "@/components/Layout";
import axios  from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";


function CategoriesPage({swal}) {
    const [name,setName] = useState ('');
    const [categories,setCategories] = useState([]);
    const[parentCategory,setParentCategory] = useState([]);
    const[editedCategory,setEditedCategory] = useState(null);
    const[properties,setProperties] = useState([]);

    useEffect(() => {fetchCategories();}, [])

    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name, 
            parentCategory,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })),
        };
        if(editedCategory){
            data._id = editedCategory._id
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else {
        await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values:values.join(',')
            }))
        );
    }

    function deleteCategory(category) {
        swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
    }).then(async result => {
        if (result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id='+_id);
            fetchCategories();
        }
    });
    }

    function addProperty() {
        setProperties(prev => {
            return[...prev, {name:'', value:''}];
        });
    }

    function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index,property,newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
           <h1> Categories </h1>
           <label>
            {editedCategory ? `Edit Category ${editedCategory.name}` 
            : 'Create New Category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1 m-2">
                    <input 
                        type="text" 
                        placeholder= {'Category name'} 
                        onChange={ev => setName(ev.target.value)}
                        value={name}/>
                    <select 
                            value={parentCategory}
                            onChange={ev => setParentCategory(ev.target.value)}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block">Properties</label>
                    <button 
                        type="button" 
                        className="btn-default mb-2 text-sm"
                        onClick={addProperty}>
                            Add Property
                    </button>
                    {properties.length > 0 && properties.map ((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input type="text" 
                                className="mb-0"
                                value={property.name} 
                                placeholder="property name (example: color)"
                                onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}/>
                            <input type="text" 
                                className="mb-0"
                                value={property.values} 
                                placeholder="values, comma separated" 
                                onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)}/>
                            <button className="btn-red"
                                type="button"
                                onClick={() => removeProperty(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex">

                {editedCategory && (
                    <button 
                    className="btn-default" 
                    type="button"
                    onClick={() => {
                        setName('');
                        setParentCategory('');
                        setEditedCategory(null);
                        setProperties([]);
                    }}>Cancel</button>
                )}
                <button className="btn-primary" type="submit">Save</button>    
                </div>            
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                            <tr>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button 
                                    className="btn-default"
                                    onClick={() => editCategory(category)}>
                                        Edit
                                    </button>
                                    <button 
                                    className="btn-red"
                                    onClick={() => deleteCategory(category)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            )}
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <CategoriesPage swal={swal} />
));