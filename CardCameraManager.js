/**
 * Created by marno on 2017/4/13
 * Function: 二维码扫描界面
 * Desc:
 */
import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';
// import Camera from 'react-native-camera';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Animated,
    Easing,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import PropTypes from 'prop-types'

export const width = Dimensions.get('window').width

export const fontRem = (width / 375) * 18
/**
 * 遮罩界面
 * 单独写一个类，方便拷贝使用
 */
class CardCameraView extends Component {
    static defaultProps = {
        maskColor: '#0000004D',
        cornerColor: '#22ff00',
        borderColor: '#000000',
        rectHeight: fontRem * 22.5,
        rectWidth: fontRem * 13.5,
        borderWidth: 0,
        cornerBorderWidth: 4,
        cornerBorderLength: 20,
        isLoading: false,
        cornerOffsetSize: 0,
        isCornerOffset: false,
        bottomMenuHeight: 0,
        onPress: {},
    };

    constructor(props) {
        super(props);

        this.getBackgroundColor = this.getBackgroundColor.bind(this);
        this.getRectSize = this.getRectSize.bind(this);
        this.getCornerSize = this.getCornerSize.bind(this);
        this.renderLoadingIndicator = this.renderLoadingIndicator.bind(this);

        this.state = {
            topWidth: 0,
            topHeight: 0,
            leftWidth: 0,
            animatedValue: new Animated.Value(0),
        }
    }

    //获取背景颜色
    getBackgroundColor() {
        return ({
            backgroundColor: this.props.maskColor,
        });
    }

    //获取扫描框背景大小
    getRectSize() {
        return ({
            height: this.props.rectHeight,
            width: this.props.rectWidth,
        });
    }

    //获取扫描框边框大小
    getBorderSize() {
        if (this.props.isCornerOffset) {
            return ({
                height: this.props.rectHeight - this.props.cornerOffsetSize * 2,
                width: this.props.rectWidth - this.props.cornerOffsetSize * 2,
            });
        } else {
            return ({
                height: this.props.rectHeight,
                width: this.props.rectWidth,
            });
        }
    }

    //获取扫描框转角的颜色
    getCornerColor() {
        return ({
            borderColor: this.props.cornerColor,
        });
    }

    //获取扫描框转角的大小
    getCornerSize() {
        return ({
            height: this.props.cornerBorderLength,
            width: this.props.cornerBorderLength,
        });
    }

    //获取扫描框大小
    getBorderWidth() {
        return ({
            borderWidth: this.props.borderWidth,
        });
    }

    //获取扫描框颜色
    getBorderColor() {
        return ({
            borderColor: this.props.borderColor,
        });
    }

    //渲染加载动画
    renderLoadingIndicator() {
        if (!this.props.isLoading) {
            return null;
        }

        return (
            <ActivityIndicator
                animating={this.props.isLoading}
                color={this.props.color}
                size='large'
            />
        );
    }

    //测量整个扫描组件的大小
    measureTotalSize(e) {
        let totalSize = e.layout;
        this.setState({
            topWidth: totalSize.width,
        })
    }

    //测量扫描框的位置
    measureRectPosition(e) {
        let rectSize = e.layout;
       
        this.setState({
            topHeight: rectSize.y,
            leftWidth: rectSize.x,
        })
    }

    //获取顶部遮罩高度
    getTopMaskHeight() {
        if (this.props.isCornerOffset) {
            return this.state.topHeight - this.props.cornerOffsetSize;
            // return this.state.topHeight + this.props.rectHeight - this.props.cornerOffsetSize;
        } else {
            console.info(this.state.topHeight)
            console.info(this.props.rectHeight)
            return this.state.topHeight
            // return this.state.topHeight + this.props.rectHeight;
        }
    }

    //获取底部遮罩高度
    getBottomMaskHeight() {
        if (this.props.isCornerOffset) {
            return this.props.rectHeight + this.state.topHeight - this.props.cornerOffsetSize;
        } else {
            return this.state.topHeight + this.props.rectHeight;
        }
    }

    //获取左右两边遮罩高度
    getSideMaskHeight() {
        if (this.props.isCornerOffset) {
            return this.props.rectHeight - this.props.cornerOffsetSize * 2;
        } else {
            return this.props.rectHeight;
        }
    }

    //获取左右两边遮罩宽度
    getSideMaskWidth() {
        if (this.props.isCornerOffset) {
            return this.state.leftWidth + this.props.cornerOffsetSize;
        } else {
            return this.state.leftWidth;
        }
    }

    getBottomMenuHeight() {
        return ({
            bottom: this.props.bottomMenuHeight,
        });
    }

    render() {
        const animatedStyle = {
            transform: [
                { translateY: this.state.animatedValue }
            ]
        };

        return (
            <View
                onLayout={({ nativeEvent: e }) => this.measureTotalSize(e)}
                style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={[styles.viewfinder, this.getRectSize()]}
                        onLayout={({ nativeEvent: e }) => this.measureRectPosition(e)}>

                        {/* 扫描框边线 */}
                        <View style={[
                            this.getBorderSize(),
                            this.getBorderColor(),
                            this.getBorderWidth(),
                        ]}></View>

                        {/* 扫描框转角-左上角 */}
                        <View style={[
                            this.getCornerColor(),
                            this.getCornerSize(),
                            styles.topLeftCorner,
                            {
                                borderLeftWidth: this.props.cornerBorderWidth,
                                borderTopWidth: this.props.cornerBorderWidth,
                            }
                        ]}></View>

                        {/* 扫描框转角-右上角 */}
                        <View style={[
                            this.getCornerColor(),
                            this.getCornerSize(),
                            styles.topRightCorner,
                            {
                                borderRightWidth: this.props.cornerBorderWidth,
                                borderTopWidth: this.props.cornerBorderWidth,
                            }
                        ]} ></View>

                        {/* 加载动画 */}
                        {this.renderLoadingIndicator()}

                        {/* 扫描框转角-左下角 */}
                        <View style={[
                            this.getCornerColor(),
                            this.getCornerSize(),
                            styles.bottomLeftCorner,
                            {
                                borderLeftWidth: this.props.cornerBorderWidth,
                                borderBottomWidth: this.props.cornerBorderWidth,
                            }
                        ]} ></View>

                        {/* 扫描框转角-右下角 */}
                        <View style={[
                            this.getCornerColor(),
                            this.getCornerSize(),
                            styles.bottomRightCorner,
                            {
                                borderRightWidth: this.props.cornerBorderWidth,
                                borderBottomWidth: this.props.cornerBorderWidth,
                            }
                        ]} ></View>
                    </View>

                    <View style={[
                        this.getBackgroundColor(),
                        styles.topMask,
                        {
                            top: 0,
                            height: this.getTopMaskHeight(),
                            // bottom: this.getTopMaskHeight(),
                            width: this.state.topWidth,
                        }
                    ]} ></View>

                    <View style={[
                        this.getBackgroundColor(),
                        styles.leftMask,
                        {
                            height: this.getSideMaskHeight(),
                            width: this.getSideMaskWidth(),
                        }
                    ]} ></View>

                    <View style={[
                        this.getBackgroundColor(),
                        styles.rightMask,
                        {
                            height: this.getSideMaskHeight(),
                            width: this.getSideMaskWidth(),
                        }]} ></View>

                    <View style={[
                        this.getBackgroundColor(),
                        styles.bottomMask,
                        {
                            bottom: 0,
                            // height: this.getTopMaskHeight() + 1,
                            top: this.getBottomMaskHeight(),
                            width: this.state.topWidth,
                        }]} ></View>
                </View>
                
                <View style={[{
                    height: fontRem * 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                this.getBackgroundColor(),
                ]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[this.getBackgroundColor(),
                        {
                            backgroundColor: 'white',
                            width: fontRem * 4,
                            height: fontRem * 4,
                            borderRadius: fontRem * 4,
                            opacity: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }]}
                        onPress={this.props.onPress} >
                        <Text style={{
                            fontSize: fontRem,
                            color: '#3498DC',
                        }}>拍照</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

/**
 * 拍照界面
 */
export default class CardCamera extends Component {
    static propTypes = {
        maskColor: PropTypes.string,
        borderColor: PropTypes.string,
        cornerColor: PropTypes.string,
        borderWidth: PropTypes.number,
        cornerBorderWidth: PropTypes.number,
        cornerBorderLength: PropTypes.number,
        rectHeight: PropTypes.number,
        rectWidth: PropTypes.number,
        isLoading: PropTypes.bool,
        isCornerOffset: PropTypes.bool,//边角是否偏移
        cornerOffsetSize: PropTypes.number,
        bottomMenuHeight: PropTypes.number,
        // onPress: PropTypes.func,
        onCardCaptured: PropTypes.func,
        isShow: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        //通过这句代码屏蔽 YellowBox
        // console.disableYellowBox = true;
        this.state = {
            showImage: false,
            uri: '',
        }
    }

    componentWillReceiveProps() {
        this.setState({
            showImage: false,
        })

    }

    render() {
        let { showImage, uri } = this.state
        let { maskColor, cornerColor, borderColor, rectHeight, rectWidth, borderWidth, cornerBorderWidth, cornerBorderLength,
             isLoading, cornerOffsetSize, isCornerOffset, bottomMenuHeight} = this.props

        return (
            <View style={{ flex: 1 }}>
                {
                    showImage ?
                        <Image style={{ flex: 1 }} source={{ uri : uri }}/>
                        : 
                        <RNCamera
                            ref={cam => this.camera = cam}
                            style={{ flex: 1, backgroundColor: 'white' }} >
                            {/* 绘制扫描遮罩 */}
                            <CardCameraView
                                maskColor={maskColor}
                                cornerColor={cornerColor}
                                borderColor={borderColor}
                                rectHeight={rectHeight}
                                rectWidth={rectWidth}
                                borderWidth={borderWidth}
                                cornerBorderWidth={cornerBorderWidth}
                                cornerBorderLength={cornerBorderLength}
                                isLoading={isLoading}
                                cornerOffsetSize={cornerOffsetSize}
                                isCornerOffset={isCornerOffset}
                                bottomMenuHeight={bottomMenuHeight}
                                onPress={this.takePhoto.bind(this)} />
                        </RNCamera>                     
                }
            </View>
        );
    }

    /**
     * @description 拍照
     * @returns 返回含有照片路径的promise
     * @memberof CardCamera
     */
    takePhoto() {
        // this.camera.capture();
        this.camera.takePictureAsync({
            width: 600,
            height: 800,
            base64: true,
            quality: 0.9
            // jpegQuality: 50,
        }).then((data) => {
            let { onCardCaptured } = this.props;
            this.setState({
                showImage: true,
                uri: data.uri,
            })
            onCardCaptured && onCardCaptured(data);
        }).catch(err => {
            console.info(err)
            this.setState({
                showImage: false,
            })
        })
    }
}


const styles = StyleSheet.create({
    buttonsContainer: {
        position: 'absolute',
        height: 100,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // top: 0,
        // right: 0,
        // left: 0,
    },
    viewfinder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topLeftCorner: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    topRightCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    bottomLeftCorner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    topMask: {
        position: 'absolute',
        top: 0,
    },
    leftMask: {
        position: 'absolute',
        left: 0,
    },
    rightMask: {
        position: 'absolute',
        right: 0,
    },
    bottomMask: {
        position: 'absolute',
        bottom: 0,
    }
});
