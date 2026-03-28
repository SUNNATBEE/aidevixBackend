/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: |
 *     ❤️ **Saqlangan kurslar (Wishlist)**
 *
 *     O'quvchilar yoqtirgan kurslarni wishlistga qo'shishlari mumkin.
 *
 *     ### Frontend misol:
 *     ```javascript
 *     // Wishlistga qo'shish
 *     await axiosInstance.post(`/api/wishlist/${courseId}`)
 *
 *     // Wishlistdan o'chirish
 *     await axiosInstance.delete(`/api/wishlist/${courseId}`)
 *
 *     // Wishlistni ko'rish
 *     const { data } = await axiosInstance.get('/api/wishlist')
 *     // data.data.courses — saqlangan kurslar
 *     ```
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: ❤️ Mening wishlistim
 *     description: |
 *       Foydalanuvchi saqlagan kurslar ro'yxati.
 *       Kurs ma'lumotlari (title, thumbnail, category, rating, price, instructor) to'liq populate qilinadi.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saqlangan kurslar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           courseId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                                 example: "React.js Frontend Development"
 *                               thumbnail:
 *                                 type: string
 *                               category:
 *                                 type: string
 *                                 example: "react"
 *                               level:
 *                                 type: string
 *                                 example: "intermediate"
 *                               rating:
 *                                 type: number
 *                                 example: 4.9
 *                               price:
 *                                 type: number
 *                                 example: 349000
 *                               isFree:
 *                                 type: boolean
 *                                 example: false
 *                               instructor:
 *                                 type: object
 *                                 properties:
 *                                   username:
 *                                     type: string
 *                                     example: "aidevix_admin"
 *                                   jobTitle:
 *                                     type: string
 *                                     example: "Senior Developer"
 *                           addedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-03-17T10:00:00.000Z"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/wishlist/{courseId}:
 *   post:
 *     summary: ➕ Wishlistga qo'shish
 *     description: Kursni wishlistga qo'shish. Allaqachon mavjud bo'lsa 400 xato.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *     responses:
 *       200:
 *         description: Qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kurs wishlistga qo'shildi"
 *       400:
 *         description: Allaqachon mavjud
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Kurs allaqachon wishlistda"
 *       404:
 *         description: Kurs topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Kurs topilmadi"
 *       401:
 *         description: Token yo'q yoki eskirgan
 *   delete:
 *     summary: ➖ Wishlistdan o'chirish
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kurs ID
 *     responses:
 *       200:
 *         description: O'chirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kurs wishlistdan olib tashlandi"
 *       404:
 *         description: Wishlist bo'sh
 *       401:
 *         description: Token yo'q yoki eskirgan
 */
