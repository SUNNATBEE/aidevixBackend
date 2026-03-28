/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: |
 *     👥 **Foydalanuvchilar o'rtasida obuna tizimi**
 *
 *     O'quvchilar bir-birlariga obuna bo'lishlari mumkin.
 *
 *     ### Frontend misol:
 *     ```javascript
 *     // Obuna bo'lish
 *     await axiosInstance.post(`/api/follow/${userId}`)
 *
 *     // Obunani bekor qilish
 *     await axiosInstance.delete(`/api/follow/${userId}`)
 *
 *     // Statistika
 *     const { data } = await axiosInstance.get(`/api/follow/${userId}/stats`)
 *     // { followers: 120, following: 45, isFollowing: true }
 *     ```
 */

/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summary: ➕ Foydalanuvchiga obuna bo'lish
 *     description: |
 *       Boshqa foydalanuvchiga obuna bo'lish.
 *       O'zingizga obuna bo'lolmaysiz (400).
 *       Ikki marta obuna bo'lolmaysiz (400).
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Obuna bo'linadigan foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Obuna bo'lindi
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
 *                   example: "Obuna bo'ldingiz"
 *       400:
 *         description: O'ziga obuna / allaqachon obuna
 *         content:
 *           application/json:
 *             examples:
 *               selfFollow:
 *                 summary: O'ziga obuna
 *                 value: { success: false, message: "O'zingizga obuna bo'lolmaysiz" }
 *               duplicate:
 *                 summary: Allaqachon obuna
 *                 value: { success: false, message: "Siz bu foydalanuvchiga allaqachon obuna bo'lgansiz" }
 *       401:
 *         description: Token yo'q yoki eskirgan
 *   delete:
 *     summary: ➖ Obunani bekor qilish
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Obuna bekor qilinadigan foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Obuna bekor qilindi
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
 *                   example: "Obuna bekor qilindi"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/follow/{userId}/stats:
 *   get:
 *     summary: 📊 Followers va following statistikasi
 *     description: |
 *       Foydalanuvchining followers/following soni va joriy user obuna bo'lganmi.
 *       Token ixtiyoriy — agar login bo'lsa `isFollowing` ko'rsatiladi.
 *     tags: [Follow]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID
 *     responses:
 *       200:
 *         description: Follow statistikasi
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
 *                     followers:
 *                       type: number
 *                       example: 120
 *                       description: Followerlar soni
 *                     following:
 *                       type: number
 *                       example: 45
 *                       description: Kuzatilayotganlar soni
 *                     isFollowing:
 *                       type: boolean
 *                       example: true
 *                       description: Joriy user obuna bo'lganmi (false agar login emas)
 */

/**
 * @swagger
 * /api/follow/my/followers:
 *   get:
 *     summary: 👥 Mening followerlarim
 *     description: |
 *       Joriy foydalanuvchiga obuna bo'lgan barcha foydalanuvchilar ro'yxati.
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followerlar ro'yxati
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
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: "jamshid_k"
 *                           email:
 *                             type: string
 *                             example: "jamshid@example.com"
 *                           jobTitle:
 *                             type: string
 *                             example: "Frontend Developer"
 *                             nullable: true
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/follow/my/following:
 *   get:
 *     summary: 👤 Men kuzatayotganlar
 *     description: |
 *       Joriy foydalanuvchi kuzatayotgan barcha foydalanuvchilar ro'yxati.
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Following ro'yxati
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
 *                     following:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                             example: "malika_r"
 *                           email:
 *                             type: string
 *                             example: "malika@example.com"
 *                           jobTitle:
 *                             type: string
 *                             nullable: true
 *       401:
 *         description: Token yo'q yoki eskirgan
 */
