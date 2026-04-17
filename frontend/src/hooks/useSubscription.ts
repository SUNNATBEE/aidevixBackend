import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectTelegramSub, selectInstagramSub, selectAllVerified, selectSubLoading,
  fetchSubscriptionStatus, verifyTelegram, verifyInstagram,
} from '@store/slices/subscriptionSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'

export function useSubscription() {
  const dispatch   = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  useEffect(() => {
    if (isLoggedIn) dispatch(fetchSubscriptionStatus())
  }, [isLoggedIn, dispatch])

  return {
    telegram:     useSelector(selectTelegramSub),
    instagram:    useSelector(selectInstagramSub),
    allVerified:  useSelector(selectAllVerified),
    loading:      useSelector(selectSubLoading),

    verifyTelegram:  (data) => dispatch(verifyTelegram(data)),
    verifyInstagram: (data) => dispatch(verifyInstagram(data)),
    refetch:         ()     => dispatch(fetchSubscriptionStatus()),
  }
}
