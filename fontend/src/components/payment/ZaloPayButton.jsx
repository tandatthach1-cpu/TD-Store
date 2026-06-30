import { useState } from "react";
import { API_BASE_URL } from "../../utils/storefront";

export default function ZaloPayButton({
  amount,
  orderInfo,
  userId,
  onBeforePay,
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const prepared = onBeforePay ? await onBeforePay() : null;
      const paymentAmount = Number(prepared?.amount ?? amount) || 0;
      const paymentOrderInfo = prepared?.orderInfo || orderInfo;
      const paymentUserId = prepared?.userId ?? userId;
      const paymentOrderId = prepared?.orderId ?? prepared?.id ?? null;

      const response = await fetch(`${API_BASE_URL}/zalopay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentAmount,
          orderInfo: paymentOrderInfo,
          userId: paymentUserId,
          orderId: paymentOrderId,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Không tạo được thanh toán ZaloPay.");
      }

      const orderUrl = data?.order_url || data?.orderUrl;
      if (orderUrl) {
        window.open(orderUrl, "_blank", "noopener,noreferrer");
      }

      onSuccess?.({ ...data, prepared });
    } catch (error) {
      console.error(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="block w-full rounded-2xl bg-[#0B9BF2] py-4 text-center font-semibold text-white transition-colors hover:bg-[#0A85C9] disabled:opacity-50"
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? "Đang mở ZaloPay..." : "Thanh toán ZaloPay"}
    </button>
  );
}
