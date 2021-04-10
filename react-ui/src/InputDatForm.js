import React, { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function InputDatForm() {
    const [species, setSpecies] = useState({
        epochs: 100,
        rate: 0.06,
        sepalLength: '',
        sepalWidth: '',
        petalLength: '',
        petalWidth: '',
    });
    const [showLoading, setShowLoading] = useState(false);
    const [predict, setPredict] = useState('');

    const getSpecies = (e) => {
        setShowLoading(true);
        e.preventDefault();
        const data = {
            epochs: species.epochs,
            rate: species.rate,
            sepal_length: species.sepalLength,
            sepal_width: species.sepalWidth,
            petal_length: species.petalLength,
            petal_width: species.petalWidth,
        };
        const apiUrl =
            `http://localhost:3000/run?` +
            `sepal_length=${data.sepal_length}&sepal_width=${data.sepal_width}` +
            `&petal_length=${data.petal_length}&petal_width=${data.petal_width}` +
            `&epochs=${data.epochs}&rate=${data.rate}`;
        axios
            .get(apiUrl)
            .then((result) => {
                console.log(result);
                setPredict(result.data.result);
                setShowLoading(false);
            })
            .catch((error) => setShowLoading(false));
    };

    const onChange = (e) => {
        e.persist();
        setSpecies({ ...species, [e.target.name]: e.target.value });
    };
    return (
        <div>
            <main className='container'>
                <div className='starter-template text-center py-5 px-3'>
                    {showLoading && (
                        <Spinner animation='border' role='status'>
                            <span className='sr-only'>Loading...</span>
                        </Spinner>
                    )}
                    {predict && (
                        <Result result={predict} setPredict={setPredict} />
                    )}
                    <br />
                    <br />
                    {!predict && (
                        <Form onSubmit={getSpecies}>
                            <h1 className='singup-title'>Species Checking</h1>
                            <p className='lead'>Please fill in the information</p>
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='sepalLength'
                                        className='col-form-label'
                                    >
                                        Sepal Length
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='sepalLength'
                                        name='sepalLength'
                                        step='0.1'
                                        min='0'
                                        className='form-control'
                                        value={species.sepalLength}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='sepalWidth'
                                        className='col-form-label'
                                    >
                                        Sepal Width
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='sepalWidth'
                                        name='sepalWidth'
                                        step='0.1'
                                        min='0'
                                        className='form-control'
                                        value={species.sepalWidth}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='petalLength'
                                        className='col-form-label'
                                    >
                                        Petal Length
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='petalLength'
                                        name='petalLength'
                                        step='0.1'
                                        min='0'
                                        className='form-control'
                                        value={species.petalLength}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='petalWidth'
                                        className='col-form-label'
                                    >
                                        Petal Width
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='petalWidth'
                                        name='petalWidth'
                                        step='0.1'
                                        min='0'
                                        className='form-control'
                                        value={species.petalWidth}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='rate'
                                        className='col-form-label'
                                    >
                                        Learning Rate
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='rate'
                                        name='rate'
                                        step='0.01'
                                        min='0'
                                        className='form-control'
                                        value={species.rate}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='row g-3 justify-content-center'>
                                <div className='col-2'>
                                    <label
                                        htmlFor='epochs'
                                        className='col-form-label'
                                    >
                                        Epochs
                                    </label>
                                </div>
                                <div className='col-3'>
                                    <input
                                        type='number'
                                        id='epochs'
                                        name='epochs'
                                        min='50'
                                        step='1'
                                        className='form-control'
                                        value={species.epochs}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <Button variant='success' type='submit'>
                                Get species
                            </Button>
                        </Form>
                    )}
                </div>
            </main>
        </div>
    );
}

function Result(props) {
    const { result, setPredict } = props;
    return (
        <>
            <h1>We predict [{result}]</h1>
            <img
                src={`/img/${result}.jpg`}
                style={{ maxWidth: '500px' }}
                alt=''
                srcSet=''
            />
            &nbsp;
            <div className='row justify-content-center p-3'>
                <Button
                    variant='success'
                    type='submit'
                    onClick={() => setPredict('')}
                >
                    New dataset
                </Button>
            </div>
        </>
    );
}

export default InputDatForm;
