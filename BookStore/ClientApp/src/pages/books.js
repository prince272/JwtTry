import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useAuth } from '../utils/auth';
import { Modal, Button } from 'react-bootstrap';
import * as cases from 'change-case';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import _, { set } from 'lodash'

function EditBookModal({ modal, setModal, books, setBooks }) {
    const auth = useAuth();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            id: "0",
            name: "Unamed book",
            category: "action",
            price: 0,
            ...modal.defaultValues,
        },
    });


    const handleClose = () => {
        setModal(() => ({ ...modal, show: false }));
    };

    const onSubmit = (values) => {
        const doingAction = ({
            'add': 'adding',
            'edit': 'updating',
            'delete': 'deleteing'
        })[modal.action];

        toast.promise(
            ({
                'add': () => axios.post(`/api/books`, values, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
                'edit': () => axios.put(`/api/books/${values.id}`, values, { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
                'delete': () => axios.delete(`/api/books/${values.id}`, { headers: { Authorization: `Bearer ${auth.accessToken}` } })
            })[modal.action](),
            {
                loading: `${cases.pascalCase(doingAction)} book.`,
                success: (result) => {

                    const crud = (items, item, action) => {
                        items = _.cloneDeep(items);

                        const index = items.findIndex(_item => _item.id == item.id);

                        if (index > -1) {
                            if (action == 'edit') items[index] = item;
                            else if (action == 'delete') items.splice(index, 1);
                        }
                        else {
                            if (action == 'add') {
                                items.push(item);
                            }
                        }

                        return items;
                    }

                    const book = {
                        ...values,
                        id: result.data?.id || values.id,
                    };
                    setBooks(books => crud(books, book, modal.action));
                    setModal(modal => ({ ...modal, show: false }));
                    return `${cases.pascalCase(doingAction)} complete.`;
                },
                error: (error) => {
                    console.error(error);
                    return `Someting went wrong.`;
                },
            },
        );
    };

    return (
        <>
            <Modal show={modal.show} onHide={handleClose} onExited={() => setModal(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>{cases.pascalCase(modal.action)} Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className={modal.action == 'delete' ? 'd-none' : ''} onSubmit={handleSubmit(onSubmit)}>
                        <input {...register("id")} type="hidden" />
                        <div className="form-floating mb-3">
                            <input {...register("name")} className="form-control" id="nameInput" />
                            <label htmlFor="nameInput">Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <select className="form-select" id="categoryInput" {...register("category")}>
                                <option value="action">Action</option>
                                <option value="classics">Classics</option>
                                <option value="comic">Comic</option>
                                <option value="mystery">Mystery</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="horror">Horror</option>
                            </select>
                            <label htmlFor="categoryInput">Category</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input className="form-control" {...register("description")} id="descriptionInput" />
                            <label htmlFor="descriptionInput">Description</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input {...register("price")} className="form-control" id="priceInput" />
                            <label htmlFor="priceInput">Price</label>
                        </div>
                    </form>
                    {modal.action == 'delete' && 'Are you sure you want to delete the book?'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant={modal.action == 'delete' ? 'danger' : 'primary'} onClick={() => handleSubmit(onSubmit)()}>
                        {modal.action == 'delete' ? 'Delete' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const BooksComponent = () => {
    const [books, setBooks] = useState([]);
    const auth = useAuth();
    const [modal, setModal] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('/api/books', { headers: { Authorization: `Bearer ${auth.accessToken}` } });
                setBooks(response.data);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        };

        fetchData();

    }, []);

    return (
        <>
            <div className="container">
                <div className="py-5">
                    <div className="d-flex justify-content-between">
                        <h3>My Books ({books.length})</h3>
                        <button type="button" className="btn btn-primary" onClick={() => { setModal({ show: true, action: 'add' }); }}>Add Book</button>
                    </div>
                    <table className="table mb-5">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => {
                                return (
                                    <tr>
                                        <th>{book.id}</th>
                                        <td>{book.name}</td>
                                        <td>{book.category}</td>
                                        <td>{book.description}</td>
                                        <td>{book.price}</td>
                                        <th>
                                            <div className="hstack gap-3">
                                                <Button variant="outline-secondary" onClick={() => { setModal({ show: true, action: 'edit', defaultValues: book }) }}>Edit</Button>
                                                <Button variant="danger" onClick={() => { setModal({ show: true, action: 'delete', defaultValues: book }) }}>Delete</Button>
                                            </div>
                                        </th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {modal && <EditBookModal {...{ modal, setModal, books, setBooks }} />}
        </>
    );
};

export default BooksComponent;