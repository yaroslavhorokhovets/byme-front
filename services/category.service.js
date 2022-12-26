import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const menuCategoryUrl = `${publicRuntimeConfig.apiUrl}/category-default`;
const filterCategoryUrl = `${publicRuntimeConfig.apiUrl}/actions/filter/category`;
const filterPhotoUrl = `${publicRuntimeConfig.apiUrl}/image/actions/filter`;

export const categoryService = {
    getMenuCategories,
    getCurrentCategory,
    getFilterCategories,
    getFilterPhotos,
    getDetailCategory,
    getSubChildCategory
};

function getSubChildCategory(categoryId) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/${categoryId}/sub-child-category`)
        .then(response => {
            if (response.code == 200) {
                const data = response.data;
                // const menus = data.map((menu) => {
                //     return {
                //         id: menu.id,
                //         title: menu.name,
                //         url: `/photo/${menu.id}`,
                //         child: menu.child_categories
                //     }
                // });
                return data;
            } else {
                return {};
            }
        });
}

function getDetailCategory(categoryId) {
    return fetchWrapper.get(`${menuCategoryUrl}`)
        .then(response => {
            if (response.code == 200) {
                const data = response.data;
                const category = data.filter((item) => {
                    return categoryId == item._id;
                });
                return category;
            } else {
                return {};
            }
        });
}

function getMenuCategories() {
    return fetchWrapper.get(`${menuCategoryUrl}`)
        .then(response => {
            if (response.code == 200) {
                const data = response.data;
                const menus = data.map((menu) => {
                    return {
                        id: menu._id,
                        title: menu.name,
                        code: menu.code,
                        url: `/photo/${menu._id}`
                        // url: `/photo?slug=${menu.code}`
                    }
                });
                return menus;
            } else {
                return {};
            }
        });
}

function getCurrentCategory(id) {
    return fetchWrapper.get(`${menuCategoryUrl}`)
        .then(response => {
            if (response.code == 200) {
                const data = response.data;
                const menus = data.filter((menu) => {
                    return menu._id == id;
                });
                if (menus.length) {
                    const first = menus[0];
                    return {
                        id: first._id,
                        title: first.name,
                        code: first.code,
                        url: `/photo/${first._id}`
                        // url: `/photo?slug=${first.code}`
                    }
                }
            } else {
                return {};
            }
        });
}

function getFilterCategories(number_next_step, root_category_id, code_root_category, parent_id, search) {
    return fetchWrapper.post(`${filterCategoryUrl}`, {
        number_next_step: number_next_step, 
        root_category_id: root_category_id, 
        code_root_category: code_root_category, 
        parent_id: parent_id, 
        search: search
    }).then(response => {
        if (response.code == 200) {
            const categories = response.data.map((category) => {
                return {
                    id: category._id,
                    name: category.name,
                    name_japan: category.name_japan
                }
            });
            return categories;
        } else {
            return {};
        }
    });
}

function getFilterPhotos(page, per_page, category_ids, root_category_id) {
    return fetchWrapper.post(`${filterPhotoUrl}?page=${page}&per_page=${per_page}`, { 
        category_ids, 
        root_category_id 
    }).then(response => {
        if (response.code == 200) {
            const results = {
                data: response.data,
                page: response.page
            }
            return results;
        } else {
            return {};
        }
    });
}



