import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { 
  CreditCard, CheckCircle, AlertCircle, ArrowLeft, 
  Lock, Calendar, ChevronsRight, Info 
} from 'lucide-react';

interface PaymentPageProps {}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

interface OrderDetails {
  _id: string;
  salonId: {
    _id: string;
    name: string;
  };
  serviceId: {
    _id: string;
    name: string;
  };
  staffId: {
    _id: string;
    name: string;
  };
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
  price: number;
  salonName?: string; // Added for display purposes
}

interface QPayData {
  qrImage: string;
  expiresAt: string;
}

interface PaymentResponse {
  success: boolean;
  payment: {
    _id: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    cardLastFour?: string;
  };
  qrData?: QPayData;
  message: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qpay'>('card');
  const [qpayData, setQpayData] = useState<QPayData | null>(null);

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });

  useEffect(() => {
    if (!orderId) {
      console.log(orderId);
      setErrorMessage("Захиалгын дугаар олдсонгүй");
      return;
    }

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error("Захиалгын мэдээлэл олдсонгүй");
        }
        
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setErrorMessage("Захиалгын мэдээлэл олдсонгүй");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cardNumber') {
      const digitsOnly = value.replace(/\D/g, '');

      let formattedValue = '';
      for (let i = 0; i < digitsOnly.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += ' ';
        }
        formattedValue += digitsOnly[i];
      }

      const limitedValue = formattedValue.slice(0, 19);
      
      setPaymentDetails(prev => ({
        ...prev,
        [name]: limitedValue
      }));
      return;
    }
    
    if (name === 'expiryDate') {
      const digitsOnly = value.replace(/\D/g, '');
      let formattedValue = digitsOnly;
      
      if (digitsOnly.length > 2) {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
      }
      
      setPaymentDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // CVV - limit to 3 or 4 digits
    if (name === 'cvv') {
      const digitsOnly = value.replace(/\D/g, '');
      setPaymentDetails(prev => ({
        ...prev,
        [name]: digitsOnly.slice(0, 4)
      }));
      return;
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const processCardPayment = async () => {
    if (!orderDetails) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/payments/card/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: paymentDetails.cardNumber.replace(/\s/g, ''),
          cardHolder: paymentDetails.cardHolder,
          expiryDate: paymentDetails.expiryDate,
          cvv: paymentDetails.cvv,
          amount: orderDetails.price
        }),
      });
      
      const data: PaymentResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Төлбөр төлөхөд алдаа гарлаа");
      }
      
      setPaymentSuccess(true);
      
      // Redirect after successful payment
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Төлбөр төлөхөд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const processQpayPayment = async () => {
    console.log(orderDetails);
    if (!orderDetails) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch(`${API_URL}/payments/qpay/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderDetails.price
        }),
      });
      
      const data: PaymentResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "QPay төлбөр үүсгэхэд алдаа гарлаа");
      }
      
      if (data.qrData) {
        setQpayData(data.qrData);
      } else {
        throw new Error("QPay QR код үүсгэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("QPay error:", error);
      setErrorMessage(error instanceof Error ? error.message : "QPay төлбөр үүсгэхэд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {

    setErrorMessage(null);
    
    if (paymentMethod === 'card') {

      if (!validateCardDetails()) {
        return;
      }
      processCardPayment();
    } else {

      processQpayPayment();
    }
  };

  const validateCardDetails = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;
    

    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    
    if (cardNumberDigits.length !== 16) {
      setErrorMessage("Картын дугаар 16 оронтой байх ёстой");
      return false;
    }
    
    if (!cardHolder.trim()) {
      setErrorMessage("Картын эзэмшигчийн нэрийг оруулна уу");
      return false;
    }
    
    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryPattern.test(expiryDate)) {
      setErrorMessage("Дуусах хугацааг MM/YY форматаар оруулна уу");
      return false;
    }
    
    // Check if card is expired
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; 
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || 
       (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setErrorMessage("Картын хугацаа дууссан байна");
      return false;
    }
    
    if (cvv.length < 3) {
      setErrorMessage("CVV/CVC код буруу байна");
      return false;
    }
    
    return true;
  };

  // Check QPay payment status
  const checkQPayStatus = async () => {
    if (!orderId) return;
    
    try {
      const response = await fetch(`${API_URL}/payments/${orderId}`);
      const payment = await response.json();
      
      if (payment.status === 'completed') {
        setPaymentSuccess(true);
        
        // Redirect after successful payment
        setTimeout(() => {
          navigate('/bookings');
        }, 3000);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Poll for QPay payment status if qpayData exists
  useEffect(() => {
    if (!qpayData) return;
    
    const interval = setInterval(() => {
      checkQPayStatus();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [qpayData]);

  if (isLoading && !orderDetails) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (errorMessage && !orderDetails) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-lg text-red-500">{errorMessage}</p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
          >
            Захиалгууд руу буцах
          </button>
        </div>
      </Layout>
    );
  }

  if (paymentSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-green-500 mb-2">Төлбөр амжилттай!</h2>
          <p className="text-gray-600 mb-8">Таны төлбөр амжилттай хийгдлээ. Таны захиалга баталгаажлаа.</p>
          <div className="animate-pulse text-blue-500">Захиалгын жагсаалт руу шилжих болно...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-8 pb-20">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 md:p-8 text-white">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center bg-purple-400 hover:bg-purple-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300"
            >
              <ArrowLeft size={16} className="mr-1" /> Буцах
            </button>
            <h1 className="text-2xl md:text-3xl font-bold mt-6">Төлбөр төлөх</h1>
            <p className="text-white/80 mt-2">Захиалгын дугаар: {orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Төлбөрийн мэдээлэл</h2>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  {errorMessage}
                </div>
              )}
              
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Төлбөрийн хэлбэр сонгох
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg border ${paymentMethod === 'card' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'} flex items-center justify-center`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={20} className={paymentMethod === 'card' ? 'text-blue-500 mr-2' : 'text-gray-400 mr-2'} />
                    <span className={paymentMethod === 'card' ? 'font-medium text-blue-500' : 'text-gray-700'}>Карт</span>
                  </button>
                  <button
                    className={`p-4 rounded-lg border ${paymentMethod === 'qpay' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'} flex items-center justify-center`}
                    onClick={() => setPaymentMethod('qpay')}
                  >
                    <div className={`w-5 h-5 mr-2 flex items-center justify-center rounded-sm ${paymentMethod === 'qpay' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      Q
                    </div>
                    <span className={paymentMethod === 'qpay' ? 'font-medium text-blue-500' : 'text-gray-700'}>QPay</span>
                  </button>
                </div>
              </div>
              
              {paymentMethod === 'card' ? (
                /* Credit Card Form */
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Картын дугаар
                    </label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={19}
                        />
                        <div className="absolute right-3 top-3">
                          <svg viewBox="0 0 36 24" width="40" height="24" className="text-gray-400">
                            <rect width="36" height="24" rx="4" fill="#EEEEEE"/>
                            <path d="M10.5 16.5h15M10.5 12.5h15M10.5 8.5h15" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Картын эзэмшигчийн нэр
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={paymentDetails.cardHolder}
                      onChange={handleInputChange}
                      placeholder="БОЛДБААТАР БАТСҮХ"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Хүчинтэй хугацаа
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={5}
                        />
                        <Calendar size={16} className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV/CVC код
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={4}
                        />
                        <Info size={16} className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      name="saveCard"
                      checked={paymentDetails.saveCard}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                      Картын мэдээллийг хадгалах
                    </label>
                  </div>
                </div>
              ) : (
                /* QPay QR Code */
                <div className="text-center py-4">
                  {qpayData ? (
                    <div>
                      <div className="bg-gray-100 rounded-lg p-6 inline-block mb-4">
                        <img 
                          src={qpayData.qrImage} 
                          alt="QPay QR Code" 
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-gray-700 mb-2">QR кодыг уншуулж төлбөрөө төлнө үү</p>
                      <p className="text-sm text-gray-500">
                        QR код {new Date(qpayData.expiresAt).toLocaleTimeString()} хүртэл хүчинтэй
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-6 inline-block mb-4">
                      <div className="w-48 h-48 mx-auto bg-white p-2 relative flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          ) : (
                            "QR код үүсгэхийн тулд доорх товчийг дарна уу"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8">
                <button
                  className={`w-full py-3 font-medium rounded-lg transition-colors ${
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={handlePayment}
                  disabled={isLoading || (paymentMethod === 'qpay' && qpayData !== null)}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Боловсруулж байна...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {paymentMethod === 'card' ? "Төлбөр төлөх" : qpayData ? "Төлбөр хүлээгдэж байна..." : "QPay QR код үүсгэх"}
                      <ChevronsRight size={16} className="ml-1" />
                    </div>
                  )}
                </button>
              </div>
              
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Lock size={14} className="mr-1" />
                Таны төлбөрийн мэдээлэл найдвартай хамгаалагдсан
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Захиалгын хураангуй</h2>
              
              {orderDetails && (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Үйлчилгээ</span>
                      <span className="font-medium">{orderDetails.serviceId?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Салон</span>
                      <span className="font-medium">{orderDetails.salonId?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Ажилтан</span>
                      <span className="font-medium">{orderDetails.staffId?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Огноо, цаг</span>
                      <span className="font-medium">{orderDetails.date}, {orderDetails.time}</span>
                    </div>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Үйлчилгээний үнэ</span>
                      <span className="font-medium">{orderDetails.price}₮</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Хямдрал</span>
                      <span className="font-medium text-green-500">-0₮</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Үйлчилгээний хураамж</span>
                      <span className="font-medium">0₮</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Нийт төлбөр</span>
                      <span className="font-bold text-lg text-blue-600">{orderDetails.price}₮</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;