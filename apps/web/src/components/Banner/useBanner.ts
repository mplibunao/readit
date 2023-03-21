import { atom, useAtom } from 'jotai'

type BannerItem = {
	children: React.ReactNode
	id: string
}

const bannersAtom = atom<BannerItem[]>([])

const addUniqueBannerAtom = atom(null, (get, set, banner: BannerItem) => {
	const banners = get(bannersAtom)
	if (!banners.find((b) => b.id === banner.id)) {
		set(bannersAtom, [...banners, banner])
	}
})

export const useBanner = () => {
	const [banners, setBanners] = useAtom(bannersAtom)
	const addBanner = useAtom(addUniqueBannerAtom)[1]

	const removeBanner = (id: string) => {
		setBanners((banners) => banners.filter((item) => item.id !== id))
	}

	return { banners, addBanner, removeBanner }
}
