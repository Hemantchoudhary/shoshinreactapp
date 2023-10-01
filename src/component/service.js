import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';
import { Modal, Button, Form, Input ,notification } from 'antd';
import moment from 'moment'; 


const Service = () => {
    const [serviceData, setServiceData] = useState([]);
    const [IsModalVisible ,setIsModalVisible] =useState(false);
    const [serviceInfo ,setserviceInfo] =useState({});
    const [BookingView ,setBookingView] =useState([]);
    const [openBookingView ,setopenBookingView] =useState(false);


    const [form] = Form.useForm();


    useEffect(() => {
         apiLoad();
      }, []);

      function apiLoad(){
        const apiUrl = 'http://localhost:5000/api/services';
        axios.get(apiUrl)
          .then((response) => {
            setServiceData(response.data.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }


      const handleSave = (values) => {
        console.log('Submitted values:', values);
        const {service_name , id } = serviceInfo;

        let PARAMS ={
            services_id : id,
            service_name: service_name,
            ...values
        }
        const apiUrl = 'http://localhost:5000/api/bookings';
        axios.post(apiUrl ,PARAMS)
        .then((response) => {
            apiLoad();
            notification.success({
                message: 'Booking',
                description: 'Booking Created Succesfully!',
            });
         
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          notification.error({
            message:  error?.response?.data?.error
           
        });
        });
    
        form.resetFields();
        setIsModalVisible(false);
      };


      const handleClear = () => {
        form.resetFields();
      };

      function openModal(data){
        setserviceInfo(data);
        setIsModalVisible(true);
      };

      function Booking(data){
        setopenBookingView(true);
        setBookingView(data.bookings);
      }


      return (
        <>
        <div className="service-container">
          <h1>Services</h1>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Server Name</th>
                <th>Created At</th>
                <th>Booking Services</th>
              </tr>
            </thead>
            <tbody>
              {serviceData.length >0 ?serviceData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}
                  </td>
                  <td><div className='innertd'>
                    <div className='tdvalue'>
                    {item.service_name}
                    </div>
                    <div className='tdvalue'>
                        <button onClick= {()=> Booking(item)}> Booking details</button>
                     </div> 
                   </div>    
                  </td>
                  <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td>
                    <button className="action-button" onClick={() => openModal(item)}>create booking</button>
                  </td>
                </tr>
              )):<tr><td colspan={4}>NO SERVICE AVAILABLE  !</td></tr>}
            </tbody>
          </table>
        </div>

        <Modal
        title="Create Booking"
        visible={IsModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="booking_form"
          onFinish={handleSave} 
        >
          <Form.Item
            label="Booking Name"
            name="booking_name"
            rules={[
              {
                required: true,
                message: 'Please input the booking name!',
              },
            ]}
          >
            <Input placeholder="Enter booking name" />
          </Form.Item>
          <Form.Item
            label="Created By"
            name="created_by"
            rules={[
              {
                required: true,
                message: 'Please input the creator name!',
              },
            ]}
          >
            <Input placeholder="Enter created by" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={handleClear} style={{ marginLeft: '8px' }}>
              Clear
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Booking List"
        visible={openBookingView}
        onCancel={() => setopenBookingView(false)}
        footer={null}
      >
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Id</th>
                <th>Booking Name</th>
                <th>Created At</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {BookingView.length >0 ? BookingView.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}
                  </td>
                  <td>{item.booking_name}   
                  </td>
                  <td>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                  <td>
                   {item.created_by}
                  </td>
                </tr>
              ))
             :<tr><td colspan={4}>No Booking Till Now</td></tr>}
            </tbody>
          </table>
       
      </Modal>
        </>
      );
};

export default Service;
