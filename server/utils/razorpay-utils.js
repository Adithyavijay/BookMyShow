// utils/razorpayUtil.js
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Utility class for Razorpay operations
 */
class RazorpayUtil {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    /**
     * @desc Create a new Razorpay order
     * @param {number} amount - The amount for the order in paise
     * @returns {Promise<Object>} The created Razorpay order object
     */
    async createOrder(amount) {
        const options = {
            amount,
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };
        return await this.razorpay.orders.create(options);
    }

    /**
     * @desc Verify the Razorpay signature
     * @param {string} orderId - The Razorpay order ID
     * @param {string} paymentId - The Razorpay payment ID
     * @param {string} signature - The signature to verify
     * @returns {boolean} True if the signature is valid, false otherwise
     */
    verifySignature(orderId, paymentId, signature) {
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
        return generated_signature === signature;
    }
}

export default new RazorpayUtil();