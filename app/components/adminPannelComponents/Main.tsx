"use client";
import { OrderData, OrderItem } from "@/types/componentTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiCurrencyRupee, HiOutlineShoppingBag } from "react-icons/hi2";
import KPIsCard from "./KPIsCard";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { IoIosLogOut } from "react-icons/io";
import { Trash2 } from "lucide-react";
import TickToggle from "./TickToggle";

const fetchOrders = async (): Promise<any[]> => {
  const res = await fetch("/api/orders");
  const data = await res.text();
  console.log("Orders API Response:", JSON.parse(data));
  return data ? JSON.parse(data) : [];
};

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<{ totalRevenue: number }[]>([]);
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const totalOrders = orders.length;
  const [showWelcome, setShowWelcome] = useState(true);
  const [sortBy, setSortBy] = useState<"orderDate" | "totalAmount" | "quantity">("orderDate");

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.accountName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  useEffect(() => {
    const loadOrders = async () => {
      const allOrders: OrderData[] = await fetchOrders();
      setOrders(allOrders);
      setLoading(false);

      const totalRevenue = allOrders.reduce((acc, order) => {
        const paymentTotal = order.orderData?.payment?.total || 0;
        console.log("Payment Total:", paymentTotal); // Add this line for debugging
        return acc + paymentTotal;
      }, 0);
      setRevenue([{ totalRevenue }]);
    };
    loadOrders();

    console.log(orders);
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("adminUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);


  useEffect(() => {
    setTimeout(() => setShowWelcome(false), 3000);
  }, []);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-gray-600">
        <div className="text-center">
          <div className="loader"></div>
          <p className="mt-4 text-white text-lg font-semibold">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    Cookies.remove("authToken");
    router.push("/login");
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "orderDate") {
      console.log("Sorting by Order Date");
      return (
        new Date(a.payment.createdAt).getTime() -
        new Date(b.payment.createdAt).getTime()
      );
    } else if (sortBy === "totalAmount") {
      console.log("Sorting by Total Amount");
      return a.payment.total - b.payment.total;
    } else if (sortBy === "quantity") {
      console.log("Sorting by Quantity");
      const qtyA = a.items?.reduce(
        (sum: number, item: OrderItem) => sum + (item.quantity || 0),
        0
      ) ?? 0;
  
      const qtyB = b.items?.reduce(
        (sum: number, item: OrderItem) => sum + (item.quantity || 0),
        0
      ) ?? 0;
  
      console.log("Quantity A:", qtyA, "Quantity B:", qtyB);
      return qtyA - qtyB;
    }
    return 0;
  });
  

  return (
    <>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-950 to-gray-500 flex justify-center   items-center text-white text-xl font-bold z-50"
        >
          Dear {username} - Welcome to Design Genre Admin Panel <br /> You have
          successfully logged in!
        </motion.div>
      )}
      <div className="border-t-2 border-b-2 w-full">
        <header className="flex flex-wrap md:flex-nowrap justify-between items-center p-4 bg-gradient-to-br from-blue-950 to-gray-500 text-white shadow-md w-full">
          <h1 className="text-lg text-white pl-6 lg:pl-0 lg:text-2xl font-bold whitespace-nowrap">
            Design Genre Dashboard
          </h1>
          <p
            className="flex items-center gap-x-3 py-2 px-2.5 text-sm text-red-500 rounded-lg mt-6"
            onClick={handleLogout}
          >
            <IoIosLogOut className="h-[19px] w-[19px] text-red-500" />
            Logout
          </p>
        </header>
      </div>
      <div className="flex min-h-screen font-sans justify-center items-center">
        <div className="w-full lg:flex-1 py-6 px-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider mb-6 text-gray-400 underline">
              Users's Orders
            </h1>
            <p className="text-darkPrimary text-lg mb-8">
              Dear{" "}
              <span className="text-lg font-bold border-b border-darkPrimary text-blue-950 ">
                {username} !
              </span>{" "}
              Welcome to Design Genre admin dashboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPIsCard
                title="Total Sales"
                value={`${revenue[0]?.totalRevenue}/-Rs`}
                icon={<HiCurrencyRupee className="text-[21px] text-white/80" />}
              />
              <KPIsCard
                title="Total Orders"
                value={totalOrders.toString()}
                icon={
                  <HiOutlineShoppingBag className="text-[21px] text-white/80" />
                }
              />
            </div>

            <div className="bg-blue-950 my-[2rem] text-white p-6">
              <div className="mb-6 flex gap-4">
                <input
                  type="text"
                  placeholder="Search orders by Account Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 rounded-lg bg-lightGray text-blue-950 placeholder-gray-800 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                {/* <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "orderDate" | "totalAmount" | "quantity"
                    )
                  }
                  className="p-2 rounded-lg bg-lightGray text-blue-950 placeholder-gray-800 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="orderDate">Sort by Order Date</option>
                  <option value="totalAmount">Sort by Total Amount</option>
                  <option value="quantity">Sort by Quantity</option>
                </select> */}
              </div>

              <div className="flex flex-col">
                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="grid grid-cols-12 md:font-bold md:text-[1rem] py-3 border-b border-gray-700 text-center  sm:text-sm sm:font-normal w-[80rem]">
                        <th className="">S.No</th>
                        <th>Account</th>
                        <th className="">Name</th>
                        <th className="">Date</th>
                        <th className="2">T.Amount</th>
                        <th className="">Quantity</th>
                        <th className="">Items</th>
                        <th className="">Address</th>
                        <th className="">Pay.Mthd</th>
                        <th className="">Phone</th>
                        <th className="">Delivered</th>
                        <th className="">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="mt-4">
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            Loading...
                          </td>
                        </tr>
                      ) : sortedOrders.length > 0 ? (
                        sortedOrders.map((order) => (
                          <tr
                            key={order?.orderData.items?.[0].id}
                            className="grid grid-cols-8 text-center py-3 border-b border-gray-700 gap-4 sm:text-sm"
                          >
                            {/* Table cells... */}
                          </tr>
                        ))
                      ) : null}
                    </tbody>
                  </table>

                  <div className="mt-4">
                    {loading ? (
                      <p className="text-center">Loading...</p>
                    ) : sortedOrders.length === 0 ? (
                      <div className="text-center">No Orders Found</div>
                    ) : (
                      sortedOrders.map((order, index) => (
                        <div
                          key={order._id}
                          className="grid grid-cols-12 py-3 border-b border-gray-700 text-center  text-sm font-normal w-[80rem]"
                        >
                          <p>{index + 1}</p>
                          <p>{order.accountName}</p>
                          <p className="">
                            {order.orderData.customer?.fullName ||
                              "No customer name available"}
                          </p>
                          <p className="pl-4">
                            {new Date(
                              order.payment.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <p className="pl-4">
                            {order.orderData?.payment.total}\-Rs
                          </p>
                          <p className="pl-4">
                            {order?.orderData?.items?.length > 0 ? (
                              order.orderData.items.map(
                                (itemGroup: any, groupIndex: number) => (
                                  <div key={groupIndex}>
                                    {Object.values(itemGroup).map(
                                      (item: any, itemIndex: number) => (
                                        <div key={itemIndex}>
                                          <p>{item.quantity}</p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )
                              )
                            ) : (
                              <p>No items available</p>
                            )}
                          </p>
                          <div className="space-y-2">
                            {order?.orderData?.items?.length > 0 ? (
                              order.orderData.items.map(
                                (itemGroup: any, groupIndex: number) => (
                                  <div key={groupIndex} className="mb-4">
                                    {Object.values(itemGroup)
                                      .filter((item: any) => item?.name) // Only show items that have a name
                                      .map((item: any, itemIndex: number) => (
                                        <div
                                          key={itemIndex}
                                          className="flex flex-col gap-1 text-sm text-white w-[120px]"
                                        >
                                          <p>● {item.name}</p>
                                          <p>● {item.price}-Rs</p>
                                          <p>● {item.size}</p>
                                          <p>● {item.category}</p>
                                          <p>-----------</p>
                                        </div>
                                      ))}
                                  </div>
                                )
                              )
                            ) : (
                              <p>No items available</p>
                            )}
                          </div>
                          <p className="pl-4">
                            {order.orderData.customer.address.fullAddress}
                          </p>
                          <p className="pl-4">{order.selectedMethod || "-"}</p>
                          <p className="pl-4">
                            {order.orderData.customer.contactNumber}
                          </p>

                          <TickToggle
                            initialValue={order.delivered}
                            orderId={order._id}
                            fieldToUpdate="delivered"
                          />

                          <TickToggle
                            initialValue={order.total_pay_completed}
                            orderId={order._id}
                            fieldToUpdate="total_pay_completed"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
