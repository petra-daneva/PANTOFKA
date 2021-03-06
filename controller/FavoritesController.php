<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 4/14/2018
 * Time: 11:17 PM
 */

namespace controller;


use model\dao\FavoritesDao;
use model\dao\SizeDao;
use model\Product;
use model\User;

class FavoritesController{

    private static $instance;

    /**
     * FavoritesController constructor.
     */
    private function __construct(){

    }

    public static function getInstance(){
        if(self::$instance === null){
            self::$instance = new FavoritesController();
        }
        return self::$instance;
    }

    public function addToFavorites(){

        if (isset($_GET['product_id'])){
            $product_id = htmlentities($_GET['product_id']);

            if ($product_id < 1 || !is_numeric($product_id)){
                die('Bad data was passed to the controller');
            }

            if (empty($_SESSION['user'])){
                die('You must be logged in to do this ');
            }

            /* @var $user_in_session User*/
            $user_in_session = &$_SESSION['user'];
            $user_id = $user_in_session->getUserId();

            try{
                $favorites = $user_in_session->getFavorites();
                if (count($favorites) > 0){
                    /* @var $favorite_item Product*/
                    foreach ($favorites as $index=>$favorite_item) {
                        if ($favorite_item->getProductId() == $product_id){
                            die('Product is already added to favorites!');
                        }
                    }
                }

                if (FavoritesDao::productIsAlreadyInFavorites($product_id , $user_id)){
                    die('Product is already added in favorites at DB');
                }

                /* @var $favorite_item Product */
                $favorite_item = FavoritesDao::addToFavorites($product_id , $user_id);
                $user_in_session->addToFav($favorite_item);
                die('Success!!! Product was added to favorites!');
            }catch (\RuntimeException $e){
                die($e->getTraceAsString() . '\n' . $e->getMessage());
            }
        }
    }

    public function getFavorites(){
        if (isset($_SESSION['user'])){
            /* @var $user_in_session User*/
            $user_in_session = &$_SESSION['user'];
            try{
                //$favorites = $user_in_session->getFavorites();
                $favorites = FavoritesDao::getFavorites($user_in_session->getUserId());
                /* @var $favorite_item Product*/
                foreach ($favorites as $index=>&$favorite_item) {
                    $favorite_item->setSizes(SizeDao::getAvailableSizes($favorite_item->getProductId()));
                }
                echo json_encode($favorites);
            }catch (\PDOException $e){
                die($e->getTraceAsString() . ';' . $e->getMessage());
            }
        }else{
           die('There is no logged user');
        }
    }

    public function deleteFavorites(){
        if (isset($_SESSION['user'])){
            /* @var $user_in_session User*/
            $user_in_session = &$_SESSION['user'];
            try{
                if (empty($user_in_session->getFavorites())){
                    die('Nothing to remove.');
                }
                if (empty(FavoritesDao::getFavorites($user_in_session->getUserId()))){ // 2nd level of security
                    die('Nothing to remove. 2; check row 100');
                }

                FavoritesDao::deleteFavorites($user_in_session->getUserId());
                $user_in_session->unsetFavorites();
                echo 'you no longer have any favorite item in our DB.';
            }catch (\PDOException $e){
                die($e->getTraceAsString() . ';' . $e->getMessage());
            }
        }else{
            die('There is no logged user');
        }
    }

    public function removeFromFavorites()
    {
        if (isset($_SESSION['user'])) {
            if (isset($_GET['id'])) {
                $product_id = htmlentities($_GET['id']);
                /* @var $user_in_session User */
                $user_in_session = &$_SESSION['user'];
                try {
                    $favorites = $user_in_session->getFavorites();
                    if (empty($favorites)){
                        die( 'Nothing to remove ');
                    }
                    $item_to_be_removed = null;
                    /* @var $single_item Product */
                    foreach ($favorites as $index=>&$single_item) {
                        /* @var $single_item Product */
                        if ($single_item->getProductId() == $product_id) {
                            $user_id = $user_in_session->getUserId();
                            FavoritesDao::removeFromFavorites($product_id, $user_id);
                            unset($favorites[$index]);
                            $user_in_session->removeFavoriteItem($index);
                            die('Item was successfully removed from favorites ');
                        }
                    }
                } catch (\PDOException $e) {
                    echo $e->getTraceAsString() . '<hr>' . $e->getMessage();
                }catch (\RuntimeException $e){
                    echo $e->getTraceAsString() . '<hr>' . $e->getMessage();
                }
            } else {
                die('There is no logged user');
            }
        }
    }
}